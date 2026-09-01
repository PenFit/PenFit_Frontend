import apiClient from "./client";

export interface HomeCodeDisplay {
  code: string;
  displayName: string;
}

export interface HomePassport {
  type: HomeCodeDisplay;
  typeSummary: string;
}

export interface HomePensionPlan {
  planId: number;
  planName: string;
  monthlyContribution: number;
  accountType: HomeCodeDisplay;
  expectedFutureAsset: number;
  contributionYears: number;
}

export interface HomeMission {
  missionId: number;
  title: string;
  description: string;
  targetAmount: number;
  dueDate: string;
  daysLeft: number;
  status: HomeCodeDisplay;
}

export interface HomeSavedProduct {
  productId: number;
  productName: string;
  providerName: string;
  investmentScope: string;
  feeMinRate: number;
  feeMaxRate: number;
}

export interface HomeSummary {
  nickname: string;
  passport: HomePassport | null;
  pensionPlan: HomePensionPlan | null;
  mission: HomeMission | null;
  savedProducts: HomeSavedProduct[];
}

interface HomeSummaryResponse {
  code: string;
  message: string;
  data: HomeSummary;
}

// 메인페이지에 필요한 패스포트, 연금계획, 미션, 담은 상품 요약을 조회
export async function getMyHome() {
  const response = await apiClient.get<HomeSummaryResponse>(
    "/api/v1/users/me/home",
  );

  return response.data.data;
}
