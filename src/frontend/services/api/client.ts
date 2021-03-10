export async function post<R = any, B extends object = any>(
  url: string,
  body: B,
): Promise<R> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: response.status < 500 ? data.message : 'Something went wrong',
      status: response.status,
    };
  }

  return data;
}

export async function put<R = any, B extends object = any>(
  url: string,
  body: B,
): Promise<R> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: response.status < 500 ? data.message : 'Something went wrong',
      status: response.status,
    };
  }

  return data;
}

export async function get(url: string) {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: response.status < 500 ? data.message : 'Something went wrong',
      status: response.status,
    };
  }

  return data;
}
