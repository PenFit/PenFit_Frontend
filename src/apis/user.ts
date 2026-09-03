import apiClient from "./client";

export interface UserMe {
  userId: number;
  nickname: string;
  email: string | null;
  emailConsent: boolean;
  loginProvider: string;
}

interface UserMeResponse {
  code: string;
  message: string;
  data: UserMe;
}

interface UpdateEmailRequest {
  email: string;
}

interface DeleteEmailResponse {
  code: string;
  message: string;
  data: string;
}

interface EmailConsentRequest {
  emailConsent: boolean;
}

interface ModifyNicknameRequest {
  nickname: string;
}

// 현재 로그인한 사용자의 회원 정보를 조회
export async function getMyInformation() {
  const response = await apiClient.get<UserMeResponse>("/api/v1/users/me");

  return response.data.data;
}

// 현재 로그인한 사용자의 이메일을 등록 또는 수정
export async function updateMyEmail(email: string) {
  const response = await apiClient.put<UserMeResponse>(
    "/api/v1/users/me/email",
    { email } satisfies UpdateEmailRequest,
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 등록 이메일을 삭제
export async function deleteEmail() {
  const response = await apiClient.delete<DeleteEmailResponse>("/api/v1/users/me/email");

  return response.data.data;
}

// 현재 로그인한 사용자의 이메일 수신 동의 여부를 변경
export async function updateEmailConsent(emailConsent: boolean) {
  const response = await apiClient.patch<UserMeResponse>(
    "/api/v1/users/me/email-consent",
    { emailConsent } satisfies EmailConsentRequest,
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 닉네임을 수정
export async function updateMyNickname(nickname: string) {
  const response = await apiClient.patch<UserMeResponse>(
    "/api/v1/users/me/nickname",
    { nickname } satisfies ModifyNicknameRequest,
  );

  return response.data.data;
}
