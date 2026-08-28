import apiClient from "./client";

export interface CodeDisplay {
  code: string;
  displayName: string;
}

export interface FinancialProfile {
  ageBand: CodeDisplay;
  occupationType: CodeDisplay;
  monthlySalary: number;
  livingExpenseBand: CodeDisplay;
  assetBand: CodeDisplay;
  debtBand: CodeDisplay;
  emergencyFundBand: CodeDisplay;
  monthlySavings: number;
  currentInvestment: number;
}

interface FinancialProfileResponse {
  code: string;
  message: string;
  data: FinancialProfile;
}

export interface CreateFinancialProfileRequest {
  ageBand: string;
  occupationType: string;
  monthlySalary: number;
  livingExpenseBand: string;
  assetBand: string;
  debtBand: string;
  emergencyFundBand: string;
  monthlySavings: number;
  currentInvestment: number;
}

// 현재 로그인한 사용자의 금융정보 프로필을 조회
export async function getMyFinancialProfile() {
  const response = await apiClient.get<FinancialProfileResponse>(
    "/api/v1/users/me/financial-profile",
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 금융정보 프로필을 최초 등록
export async function createMyFinancialProfile(profile: CreateFinancialProfileRequest) {
  const response = await apiClient.post<FinancialProfileResponse>("/api/v1/users/me/financial-profile", profile);

  return response.data.data;
}
