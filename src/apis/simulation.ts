import apiClient from "./client";

export interface RehearsalStatus {
  code: string;
  displayName: string;
}

export interface RehearsalStart {
  rehearsalId: number;
  status: RehearsalStatus;
  previewFutureAsset: number;
  totalScenarios: number;
}

interface RehearsalStartResponse {
  code: string;
  message: string;
  data: RehearsalStart;
}

export interface RehearsalScenarioContextCard {
  label: string;
  value: string;
}

export interface RehearsalScenarioOption {
  optionCode: string;
  displayOrder: number;
  label: string;
  title: string;
  description: string;
}

export interface RehearsalScenario {
  scenarioCode: string;
  displayOrder: number;
  title: string;
  badge: string;
  situation: string;
  question: string;
  baselineContribution: number;
  contextCards: RehearsalScenarioContextCard[];
  notice: string;
  options: RehearsalScenarioOption[];
}

interface RehearsalScenariosResponse {
  code: string;
  message: string;
  data: RehearsalScenario[];
}

export interface RehearsalAnswer {
  scenarioCode: string;
  optionCode: string;
  answeredAt: string;
}

export interface RehearsalAnswerSaveResult {
  rehearsalId: number;
  status: RehearsalStatus;
  previewFutureAsset: number;
  answeredCount: number;
  totalScenarios: number;
  readyToComplete: boolean;
  retryCount: number;
  failureCode: string;
  failureMessage: string;
  completedAt: string;
  answers: RehearsalAnswer[];
}

interface SaveRehearsalAnswerRequest {
  optionCode: string;
}

interface SaveRehearsalAnswerResponse {
  code: string;
  message: string;
  data: RehearsalAnswerSaveResult;
}

interface RehearsalProgressResponse {
  code: string;
  message: string;
  data: RehearsalAnswerSaveResult;
}

interface CompleteRehearsalResponse {
  code: string;
  message: string;
  data: RehearsalAnswerSaveResult;
}

interface RetryRehearsalAnalysisResponse {
  code: string;
  message: string;
  data: RehearsalAnswerSaveResult;
}

// 금융정보와 가상 연금 설정을 기반으로 연금 리허설을 시작
export async function startRehearsal() {
  const response = await apiClient.post<RehearsalStartResponse>(
    "/api/v1/users/me/rehearsals",
  );

  return response.data.data;
}

// 특정 리허설 상황에 대한 사용자 선택지를 저장
export async function saveRehearsalAnswer(
  rehearsalId: number,
  scenarioCode: string,
  optionCode: string,
) {
  const response = await apiClient.post<SaveRehearsalAnswerResponse>(
    `/api/v1/rehearsals/${rehearsalId}/answers/${scenarioCode}`,
    { optionCode } satisfies SaveRehearsalAnswerRequest,
  );

  return response.data.data;
}

// 리허설 ID에 해당하는 상황 시나리오 목록을 조회
export async function getRehearsalScenarios(rehearsalId: number) {
  const response = await apiClient.get<RehearsalScenariosResponse>(
    `/api/v1/rehearsals/${rehearsalId}/scenarios`,
  );

  return response.data.data;
}

// 리허설 진행 상태와 저장된 답변 목록을 조회
export async function getRehearsalProgress(rehearsalId: number) {
  const response = await apiClient.get<RehearsalProgressResponse>(
    `/api/v1/rehearsals/${rehearsalId}`,
  );

  return response.data.data;
}

// 리허설 답변을 제출하고 AI 분석을 시작
export async function completeRehearsal(rehearsalId: number) {
  const response = await apiClient.post<CompleteRehearsalResponse>(
    `/api/v1/rehearsals/${rehearsalId}/complete`,
  );

  return response.data.data;
}

// 실패한 AI 분석을 저장된 답변 기준으로 다시 시도
export async function retryRehearsalAnalysis(rehearsalId: number) {
  const response = await apiClient.post<RetryRehearsalAnalysisResponse>(
    `/api/v1/rehearsals/${rehearsalId}/analysis/retry`,
  );

  return response.data.data;
}
