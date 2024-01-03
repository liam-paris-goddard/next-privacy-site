
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = process.env.SNOW_USER || '';
    const pass = process.env.SNOW_PASS || '';
    const endpointRoot = process.env.SNOW_ENDPOINT_ROOT || '';
    const parmId = process.env.SNOW_PARM_ID || '';
    let endpoint = process.env.SNOW_ENDPOINT_URL_TEMPLATE || '';
    endpoint = endpoint.replace("{{EndpointRoot}}", endpointRoot);
    endpoint = endpoint.replace("{{ParmId}}", parmId);

    const result = await axios.post<Response>(endpoint, req, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }
    });



    res.status(200).json(result)
}