import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/authToken";

interface ReissueResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
  };
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 일반 API 요청에 사용하는 공통 axios 인스턴스
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 인증 API는 같은 출처 프록시를 사용해 refreshToken 쿠키를 퍼스트파티로 유지
export const authClient = axios.create({
  baseURL: "",
  withCredentials: true,
});

// accessToken 재발급 전용 인스턴스. 인터셉터 순환 호출을 막기 위해 분리
const reissueClient = axios.create({
  baseURL: "",
  withCredentials: true,
});

let reissuePromise: Promise<string> | null = null;

// 로그인/재발급 API는 401이 나도 다시 재발급을 시도하지 않음
function isAuthEndpoint(url?: string) {
  return url === "/api/v1/auth/kakao/login" || url === "/api/v1/auth/reissue";
}

export async function reissueAccessToken() {
  if (!reissuePromise) {
    reissuePromise = reissueClient
      .post<ReissueResponse>("/api/v1/auth/reissue")
      .then((response) => {
        const newAccessToken = response.data.data.accessToken;

        setAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        reissuePromise = null;
      });
  }

  return reissuePromise;
}

// 메모리에 보관 중인 accessToken이 있으면 모든 요청에 Authorization 헤더로 붙임
apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 401 응답을 받으면 refreshToken 쿠키로 새 accessToken을 발급받음
      const newAccessToken = await reissueAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // 새 accessToken으로 실패했던 원래 요청을 한 번 다시 보냄
      return apiClient(originalRequest as AxiosRequestConfig);
    } catch (reissueError) {
      // 재발급도 실패하면 저장된 로그인 정보를 정리
      clearAccessToken();
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("newUser");

      return Promise.reject(reissueError);
    }
  },
);

export default apiClient;
