import apiClient from "./client";

// 카카오 로그인 API 응답에서 실제로 사용하는 인증 데이터 구조
interface KakaoLoginResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    userId: number;
    nickname: string;
    newUser: boolean;
  };
}

// 카카오에서 받은 인가 code를 백엔드로 보내 서비스 accessToken을 발급받음
export async function loginWithKakaoCode(code: string) {
  const response = await apiClient.post<KakaoLoginResponse>("/api/v1/auth/kakao/login", { code });

  return response.data.data;
}

// 로그인 성공 후 앱에서 필요한 인증 정보를 localStorage에 저장
export function saveAuthSession(authData: KakaoLoginResponse["data"]) {
  localStorage.setItem("accessToken", authData.accessToken);
  localStorage.setItem("userId", String(authData.userId));
  localStorage.setItem("nickname", authData.nickname);
  localStorage.setItem("newUser", String(authData.newUser));
}
