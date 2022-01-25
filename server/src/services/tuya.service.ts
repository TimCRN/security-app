/* eslint-disable @typescript-eslint/no-explicit-any */
import * as qs from 'qs';
import * as crypto from 'crypto';
import {default as axios, Method} from 'axios';
import {
  Device,
  DeviceInput,
  deviceNotificationLib,
} from '../models/devices.model';
import {Users} from '../models/user.model';
import {createNotification} from './notification.service';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

// User local maintenance highway token
let token = '';

const config = {
  /* Service address */
  host: String(process.env.TUYA_HOST),
  /* Access Id */
  accessKey: String(process.env.TUYA_CLIENT_ID),
  /* Access Secret */
  secretKey: String(process.env.TUYA_SECRET),
  /* Poll Rate */
  pollRate: Number(process.env.TUYA_POLL_RATE),
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

/**
 * fetch highway login token
 */
async function getToken() {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = '/v1.0/token?grant_type=1';
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
  };
  const {data: login} = await httpClient.get('/v1.0/token?grant_type=1', {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`Authorization Failed: ${login.msg}`);
  }
  token = login.result.access_token;
}

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto
    .createHmac('sha256', secret)
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

/**
 * Request signature, which can be passed as headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path: string,
  method: string,
  // headers: {[k: string]: string} = {},
  query: {[k: string]: any} = {},
  body: {[k: string]: any} = {}
) {
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split('?');
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery: {[k: string]: string} = {};
  Object.keys(queryMerged)
    .sort()
    .forEach(i => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex');
  const stringToSign = [method, contentHash, '', url].join('\n');
  const signStr = config.accessKey + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    sign_method: 'HMAC-SHA256',
    access_token: token,
  };
}

export const connectTuya = async () => {
  try {
    await getToken();
    console.log('🔑 Tuya token acquired');
  } catch (err) {
    throw Error(`ERROR: ${err}`);
  }
};

function sleep() {
  return new Promise(resolve => setTimeout(resolve, config.pollRate));
}

export const beginTuyaPoll = async () => {
  while (true) {
    const data = await tuyaAPI.getDevices();
    if (data.success) {
      data.result.list.forEach(async (e: any) => {
        const d = await Device.findById(String(e.id));
        !d ? await addDeviceToDB(e) : await processChanges(d);
      });
    }
    await sleep();
  }
};

async function addDeviceToDB(device: {
  id: string;
  name: string;
  asset_id: string;
  model: string;
  category_name: string;
  online: boolean;
}) {
  console.log(
    `Device '${device.id}' is not present in the Database.\nAdding it to the database now ...`
  );
  let assetName;
  let status;
  try {
    assetName = (await tuyaAPI.getAssetInfo(device.asset_id)).result
      .asset_full_name;
    status = (await tuyaAPI.getDeviceStatus(device.id)).result;
  } catch {
    console.error('An error occured whilst retrieving asset/device info');
  }

  const input: DeviceInput = {
    _id: device.id,
    name: device.name,
    asset_id: device.asset_id,
    asset_name: assetName,
    model: device.model,
    category: device.category_name,
    online: device.online,
    status: status,
  };
  Device.create(input);
  console.log(`Device '${device.name}' has been added!`);
}

async function processChanges(device: DeviceInput) {
  const status = await tuyaAPI.getDeviceStatus(device._id);
  let changes = false;
  const changedIndexes: number[] = [];

  for (let index = 0; index < status.result.length; index++) {
    const element = status.result[index].value;
    if (device.status[index].value !== element) {
      console.log('\x1b[33m%s\x1b[0m', 'Change detected!');
      changedIndexes.push(index);
      changes = true;
    }
  }

  if (changes) {
    await Device.findOneAndUpdate(
      {_id: device._id},
      {$set: {status: status.result}},
      {upsert: false}
    );
    console.log(`Status changed for device ${device._id}`);
    const user = await Users.findOne({devices: device._id});

    changedIndexes.forEach(async e => {
      try {
        const nData =
          deviceNotificationLib[device.category][e][status.result[e].value];
        if (user && nData) {
          console.log(
            'Notification linked to change found. Creating push notification'
          );
          await createNotification({
            userId: user._id,
            devices: [device._id],
            title: nData.title,
            type: nData.type,
            description: nData.description?.replace(
              '%DEVICE_NAME%',
              device.name
            ),
            sentNotification: false,
            resolved: false,
          });
        }
      } catch (err) {
        console.log(
          `Error catched while trying to find/create push notification: ${
            (err as Error).message
          }`
        );
      }
    });
  }
}

class TuyaAPI {
  private async _request(url: string, method: Method, query?: {}) {
    const reqHeaders: {[k: string]: string} = await getRequestSign(
      url,
      method,
      {},
      query
    );

    const {data} = await httpClient.request({
      method,
      data: {},
      params: {},
      headers: reqHeaders,
      url: reqHeaders.path,
    });

    if (data.code === 1010) {
      console.log('Tuya Token is invalid. Attempting to fetch a new token.');
      await connectTuya();
    } else if (!data) {
      throw Error(
        'An unexpected error occured. No data was retrieved from the request'
      );
    }
    return data;
  }

  public async getDevices() {
    return this._request('/v1.2/iot-03/devices', 'GET');
  }

  public async getDeviceStatus(id: string) {
    return this._request(`/v1.0/iot-03/devices/${id}/status`, 'GET');
  }

  public async getAssetInfo(id: string) {
    return this._request(`/v1.0/iot-02/assets/${id}`, 'GET');
  }
}

export const tuyaAPI = new TuyaAPI();
