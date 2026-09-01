import apiClient from "./client";

export interface PlanAccountType {
  code: string;
  displayName: string;
}

export interface AssetAllocation {
  stockRatio: number;
  bondRatio: number;
  depositRatio: number;
}

export interface ProjectionAssumption {
  periodYears: number;
  annualReturnRate: number;
  contributionTiming: string;
  description: string;
}

export interface PensionPlan {
  pensionPlanId: number;
  passportId: number;
  planName: string;
  accountType: PlanAccountType;
  monthlyContribution: number;
  assetAllocation: AssetAllocation;
  expectedFutureAsset: number;
  projectionAssumption: ProjectionAssumption;
  recommendationReason: string;
  createdAt: string;
}

interface PensionPlanResponse {
  success: boolean;
  code: string;
  message: string;
  data: PensionPlan;
}

export interface MyPensionPlan {
  planId: number;
  planName: string;
  accountType: PlanAccountType;
  monthlyContribution: number;
  expectedFutureAsset: number;
  contributionYears: number;
  expectedReturnRate: number;
  assetAllocation: AssetAllocation;
  advantages: string[];
  recommendationReason: string;
  createdAt: string;
}

interface MyPensionPlanResponse {
  code: string;
  message: string;
  data: MyPensionPlan;
}

// 현재 로그인한 사용자의 AI 맞춤 연금계획을 생성
export async function createPensionPlan() {
  const response = await apiClient.post<PensionPlanResponse>(
    "/api/v1/users/me/pension-plan",
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 연금계획을 조회
export async function getMyPensionPlan() {
  const response = await apiClient.get<MyPensionPlanResponse>(
    "/api/v1/users/me/pension-plan",
  );

  return response.data.data;
}
