
export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
}

export async function authenticate(
  credentials: AuthenticationRequest
): Promise<Boolean> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const body = await res.json()
    throw new Error(body.message || "Could not authenticate");
  }

  setTokens(await res.json() as AuthenticationResponse)

  return true;
}

export async function register(
  credentials: AuthenticationRequest
): Promise<Boolean> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });


  if (!res.ok) {
    let body = await res.json()
    throw new Error(body.message || "Could not register");
  }

  const body = await res.json() as AuthenticationResponse;

  setTokens(body)
  return true
}

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const setTokens = (response: AuthenticationResponse) => {
  localStorage.setItem("access_token", response.accessToken);
  localStorage.setItem("refresh_token", response.refreshToken);
}

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export async function refreshAccessToken(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (res.status === 401) {
    logout()
    throw new Error("Unauthorized", { cause: 401 })
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message, { cause: res.status });
  }

  setTokens(await res.json() as AuthenticationResponse)
}
