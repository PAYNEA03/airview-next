import { serialize } from 'next-mdx-remote/serialize'

export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: 'http://localhost:9001/api/1.2.1',
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });
  let pad = null;
  try {
    // Get text for one pad
    // http://localhost:9001/api/1/getText?apikey=f50403c112c30485607554afa2cf37675ef791681ad36001134f55b05a3deca1&padID=yXpdXIgw-NSdfaXdXoGQ
    let resp = (await client.get('getText', {
      params: {
        padID: req.query.pad,
      }
    }))
    pad = resp.data.data?.text
  } catch (error) {
    console.log(error)
  }
  const mdxSource = await serialize(pad ?? 'No content')
  res.status(200).json({ source: mdxSource, })
}