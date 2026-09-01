import apiClient from "./client";

export interface MissionCodeDisplay {
  code: string;
  displayName: string;
}

export interface CategorySpending {
  category: MissionCodeDisplay;
  amount: number;
  ratio: number;
}

export interface SpendingAnalysis {
  analysisId: number;
  analysisStartDate: string;
  analysisEndDate: string;
  topCategory: MissionCodeDisplay;
  totalAmount: number;
  recurringExpense: number;
  reducibleAmount: number;
  summary: string;
  categorySpending: CategorySpending[];
  keyInsights: string[];
}

interface SpendingAnalysisResponse {
  code: string;
  message: string;
  data: SpendingAnalysis;
}

export interface BehaviorMission {
  missionId: number;
  title: string;
  description: string;
  reason: string;
  targetAmount: number;
  durationDays: number;
  dueDate: string;
  daysLeft: number;
  status: MissionCodeDisplay;
  topCategory: MissionCodeDisplay;
  topCategoryRatio: number;
  pensionImpactAmount: number;
  startedAt: string;
  completedAt: string | null;
}

interface BehaviorMissionResponse {
  code: string;
  message: string;
  data: BehaviorMission;
}

export interface BehaviorMissionCompletion {
  missionId: number;
  title: string;
  targetAmount: number;
  pensionImpactAmount: number;
  completedDate: string;
  completedAt: string;
}

export interface BehaviorMissionCompletions {
  year: number;
  completedCount: number;
  totalSavedAmount: number;
  totalPensionImpactAmount: number;
  completions: BehaviorMissionCompletion[];
}

interface BehaviorMissionCompletionsResponse {
  code: string;
  message: string;
  data: BehaviorMissionCompletions;
}

// 가상 소비내역을 분석하고 이번 주 행동 미션을 생성
export async function createSpendingAnalysis() {
  const response = await apiClient.post<SpendingAnalysisResponse>(
    "/api/v1/users/me/spending-analysis",
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 소비 분석 결과를 조회
export async function getMySpendingAnalysis() {
  const response = await apiClient.get<SpendingAnalysisResponse>(
    "/api/v1/users/me/spending-analysis",
  );

  return response.data.data;
}

// 현재 진행 중인 행동 미션을 조회
export async function getCurrentBehaviorMission() {
  const response = await apiClient.get<BehaviorMissionResponse>(
    "/api/v1/users/me/behavior-missions/current",
  );

  return response.data.data;
}

// 특정 행동 미션을 시작 상태로 변경
export async function startBehaviorMission(missionId: number) {
  const response = await apiClient.post<BehaviorMissionResponse>(
    `/api/v1/users/me/behavior-missions/${missionId}/start`,
  );

  return response.data.data;
}

// 특정 행동 미션을 완료 처리하고 예상 연금자산 증가분을 반영
export async function completeBehaviorMission(missionId: number) {
  const response = await apiClient.post<BehaviorMissionResponse>(
    `/api/v1/users/me/behavior-missions/${missionId}/complete`,
  );

  return response.data.data;
}

// 행동 미션 완료 이력을 연도별로 조회. year를 생략하면 올해 기준으로 조회
export async function getBehaviorMissionCompletions(year?: number) {
  const response = await apiClient.get<BehaviorMissionCompletionsResponse>(
    "/api/v1/users/me/behavior-missions/completions",
    {
      params: year ? { year } : undefined,
    },
  );

  return response.data.data;
}
