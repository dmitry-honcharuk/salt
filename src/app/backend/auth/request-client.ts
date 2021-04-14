import fetch, { RequestInit } from 'node-fetch';

export async function get<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: response.status < 500 ? data.message : 'Something went wrong',
      status: response.status,
    };
  }

  return data;
}
