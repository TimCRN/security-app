import axios, { Method } from "axios";


// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
    require('dotenv').config();
}
  
const config = {
    host: String(process.env.CLICKSEND_HOST),
    user: String(process.env.CLICKSEND_USER),
    pass: String(process.env.CLICKSEND_PASS)
};

const basicAuth = Buffer.from(`${config.user}:${config.pass}`).toString('base64');

const reqHeaders = {
    Authorization: `Basic ${basicAuth}`
}

const httpClient = axios.create({
    baseURL: config.host,
    timeout: 5 * 1e3,
});

class ClicksendAPI
{
    private async _request(call: string, method: Method, headers?: {}, query?: {}, reqData?: {})
    {
        const _headers = Object.assign({}, reqHeaders, headers)

        const { data } = await httpClient.request({
            method,
            data: reqData,
            params: query,
            headers: reqHeaders,
            url: call,
        });

        return data;
    }

    public async getAccountDetails()
    {
        return await this._request('/account', 'GET');
    }

}

export const clicksendAPI = new ClicksendAPI();