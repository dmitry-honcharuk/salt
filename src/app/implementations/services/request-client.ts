export async function post<
  R = any,
  B extends Record<string, unknown> | FormData = any
>(url: string, body: B): Promise<R> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(!(body instanceof FormData) && {
        'Content-Type': 'application/json',
      }),
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      status: response.status,
    };
  }

  return data;
}

export async function put<R = any, B extends Record<string, unknown> = any>(
  url: string,
  body: B
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
      message: data.message,
      status: response.status,
    };
  }

  return data;
}

export async function get<T = any>(
  url: string,
  options?: Partial<Request>
): Promise<T> {
  const response = await fetch(url, options);

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      status: response.status,
    };
  }

  return data;
}

export async function patch<R = any, B extends Record<string, unknown> = any>(
  url: string,
  body: B
): Promise<R> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      status: response.status,
    };
  }

  return data;
}

export async function del<T = any>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      status: response.status,
    };
  }

  return data;
}
