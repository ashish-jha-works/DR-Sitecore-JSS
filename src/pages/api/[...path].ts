import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [], ...query } = req.query;

  const baseUrl = `${process.env.API_BASE_URL}/${(path as string[]).join('/')}`;

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else if (value !== undefined) {
      searchParams.append(key, value);
    }
  });

  const backendUrl =
    searchParams.toString().length > 0 ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

  // Copy all incoming headers
  const headers = { ...req.headers };

  // Remove hop-by-hop or problematic headers
  delete headers.host;
  delete headers.connection;
  delete headers['content-length'];

  try {
    const apiResponse = await fetch(backendUrl, {
      method: req.method,
      headers: headers as HeadersInit,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const text = await apiResponse.text();

    const setCookie = apiResponse.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    res.status(apiResponse.status).send(tryParseJSON(text));
  } catch (error) {
    console.error('Proxy API error:', error);
    res.status(500).json({ message: 'Backend API unavailable' });
  }
}

function tryParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
