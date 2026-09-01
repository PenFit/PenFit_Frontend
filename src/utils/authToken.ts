let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
  localStorage.removeItem("accessToken");
}

export function clearAccessToken() {
  accessToken = null;
  localStorage.removeItem("accessToken");
}
