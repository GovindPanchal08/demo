const API_BASE = "http://localhost:3000/api/v1";

export interface ApiError {
  statusText?: string;
  message?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions extends RequestInit {
  method?: HttpMethod;
  token?: string;
}

function authHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(
  res: Response,
  defaultErrorMsg: string
): Promise<T> {
  if (!res.ok) {
    let errorData: ApiError = {};

    try {
      errorData = await res.json();
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(
      errorData.message ||
      errorData.statusText ||
      defaultErrorMsg ||
      res.statusText
    );
  }

  return res.json() as Promise<T>;
}

export async function apiRequest<T>(
  endpoint: string,
  {
    method = "GET",
    token,
    headers,
    body,
    ...rest
  }: ApiRequestOptions = {},
  defaultErrorMsg = "Request failed"
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      ...authHeaders(token),
      ...headers,
    },
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
    ...rest,
  });

  return handleResponse<T>(res, defaultErrorMsg);
}
