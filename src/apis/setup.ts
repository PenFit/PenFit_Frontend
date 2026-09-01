import apiClient from "./client";

export interface PensionAccountTypeComparison {
  investmentStyle: string;
  taxBenefit: string;
  keyFeature: string;
  recommendedFor: string;
}

export interface PensionAccountType {
  code: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  comparison: PensionAccountTypeComparison;
}

interface PensionAccountTypesResponse {
  code: string;
  message: string;
  data: PensionAccountType[];
}

export interface PensionSetupGrowth {
  years: number;
  futureAsset: number;
}

export interface PensionSetup {
  accountType: {
    code: string;
    displayName: string;
  };
  monthlyContribution: number;
  previewFutureAsset: number;
  expectedReturnRate: number;
  contributionYears: number;
  growth: PensionSetupGrowth[];
}

export interface CreatePensionSetupRequest {
  accountType: string;
  monthlyContribution: number;
}

interface PensionSetupResponse {
  code: string;
  message: string;
  data: PensionSetup;
}

// 리허설용 연금계좌 종류 3개를 조회
export async function getPensionAccountTypes() {
  const response = await apiClient.get<PensionAccountTypesResponse>(
    "/api/v1/pension-setups/account-types",
  );

  return response.data.data;
}

// 가상 연금계좌와 월 납입액을 최초 등록
export async function createPensionSetup(setup: CreatePensionSetupRequest) {
  const response = await apiClient.post<PensionSetupResponse>(
    "/api/v1/users/me/pension-setup",
    setup,
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 가상 연금 설정을 조회
export async function getPensionSetup() {
  const response = await apiClient.get<PensionSetupResponse>(
    "/api/v1/users/me/pension-setup",
  );

  return response.data.data;
}