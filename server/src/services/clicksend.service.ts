import axios, {Method} from 'axios';
import {
  IClicksendTextMessage,
  IClicksendVoiceMessage,
} from '../models/clicksend.model';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

const config = {
  host: String(process.env.CLICKSEND_HOST),
  user: String(process.env.CLICKSEND_USER),
  pass: String(process.env.CLICKSEND_PASS),
  dev: JSON.parse(String(process.env.CLICKSEND_DEV)),
  senderName: String(process.env.CLICKSEND_SENDER_NAME),
};

const basicAuth = Buffer.from(`${config.user}:${config.pass}`).toString(
  'base64'
);

const reqHeaders = {
  Authorization: `Basic ${basicAuth}`,
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

class ClicksendAPI {
  private async _request(
    call: string,
    method: Method,
    headers?: {},
    query?: {},
    reqData?: {}
  ) {
    const _headers = Object.assign({}, reqHeaders, headers);

    try {
      const {data} = await httpClient.request({
        method,
        data: reqData,
        params: query,
        headers: _headers,
        url: call,
      });

      return data;
    } catch {
      console.error('Clicksend api request failed');
    }
  }

  public async sendSms(messages: IClicksendTextMessage[]) {
    messages.forEach(e => {
      e.from === null ? (e.from = config.senderName) : null;
    });

    if (!config.dev) {
      await this._request('/sms/send', 'POST', {}, {}, {messages});
      console.log('SMS has been sent!');
    } else {
      console.log(messages),
        console.log(
          'SMS would have been sent. Set dev mode to false the env to enable this feature.'
        );
    }
  }

  public async sendCall(messages: IClicksendVoiceMessage[]) {
    if (!config.dev) {
      await this._request('/voice/send', 'POST', {}, {}, {messages});
      console.log('Voice call has been sent!');
    } else {
      console.log(messages),
        console.log(
          'Message would have been called. Set dev mode to false the env to enable this feature.'
        );
    }
  }
}

export const clicksendAPI = new ClicksendAPI();
