import { authClient } from "./client";
import { clearAccessToken, setAccessToken } from "../utils/authToken";

// 로그인 API 응답에서 실제로 사용하는 인증 데이터 구조
interface LoginResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    userId: number;
    nickname: string;
    newUser: boolean;
  };
}

interface LogoutResponse {
  code: string;
  message: string;
  data: string;
}

// 카카오에서 받은 인가 code를 백엔드로 보내 서비스 accessToken을 발급받음
export async function loginWithKakaoCode(code: string) {
  const response = await authClient.post<LoginResponse>("/api/v1/auth/kakao/login", { code });

  return response.data.data;
}

// 심사용 데모 계정을 만들고 서비스 accessToken을 발급받음
export async function loginWithDemoAccount() {
  const response = await authClient.post<LoginResponse>("/api/v1/auth/demo-login");

  return response.data.data;
}

// 백엔드 로그아웃 API를 호출해 refreshToken 쿠키를 만료시킴
export async function logout() {
  const response = await authClient.post<LogoutResponse>("/api/v1/auth/logout");

  return response.data;
}

// 로그인 성공 후 accessToken은 메모리에만 두고, 화면 표시에 필요한 정보만 저장
export function saveAuthSession(authData: LoginResponse["data"]) {
  setAccessToken(authData.accessToken);
  localStorage.setItem("userId", String(authData.userId));
  localStorage.setItem("nickname", authData.nickname);
  localStorage.setItem("newUser", String(authData.newUser));
}

// 브라우저에 저장된 로그인 정보를 제거
export function clearAuthSession() {
  clearAccessToken();
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  localStorage.removeItem("newUser");
}
