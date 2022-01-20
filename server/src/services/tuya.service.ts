import * as qs from 'qs';
import * as crypto from 'crypto';
import {default as axios} from 'axios';
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

async function main() {
  await getToken();
  console.log('🔑 Tuya token acquired');
}

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
  headers: {[k: string]: string} = {},
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
  main().catch(err => {
    throw Error(`ERROR: ${err}`);
  });
};

function sleep() {
  return new Promise(resolve => setTimeout(resolve, config.pollRate));
}

export const beginTuyaPoll = async () => {
  while (true) {
    const data = await tuyaAPI.getDevices();
    data.result.list.forEach(async (e: any) => {
      const d = await Device.findById(String(e.id));
      if (!d) {
        await addDeviceToDB(e);
      } else {
        await processChanges(d);
      }
    });
    await sleep();
  }
};

async function addDeviceToDB(device: {
  id: string;
  name: any;
  model: any;
  category_name: any;
  online: any;
}) {
  console.log(
    `Device '${device.id}' is not present in the Database.\nAdding it to the database now ...`
  );
  const input: DeviceInput = {
    _id: device.id,
    name: device.name,
    model: device.model,
    category: device.category_name,
    online: device.online,
    status: (await tuyaAPI.getDeviceStatus(device.id)).result,
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
      const nData =
        deviceNotificationLib[device.category][e][status.result[e].value];
      if (user && nData) {
        console.log(
          'Notification linked to change found. Creating push notification'
        );
        await createNotification({
          userId: user._id,
          title: nData.title,
          type: nData.type,
          description: nData.description,
          sentNotification: false,
          resolved: false,
        });
      }
    });
  }
}

class TuyaAPI {
  public async getDevices() {
    const query = {};
    const method = 'GET';
    const url = '/v1.2/iot-03/devices';
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

    if (!data || !data.success) {
      throw Error(`Request highway Failed: ${data.msg}`);
    } else {
      console.log(`Devices pulled ${Date.now()}`);
      return data;
    }
  }

  public async getDeviceStatus(id: string) {
    const query = {};
    const method = 'GET';
    const url = `/v1.0/iot-03/devices/${id}/status`;
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

    if (!data || !data.success) {
      throw Error(`Request highway Failed: ${data.msg}`);
    } else {
      return data;
    }
  }
}

export const tuyaAPI = new TuyaAPI();
