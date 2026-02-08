type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string;
};

const API_BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {},
) => {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
