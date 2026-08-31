import apiClient from "./client";

export interface CodeDisplay {
  code: string;
  displayName: string;
}

export interface PensionPassportDetail {
  scenario: CodeDisplay;
  selectedOptionCode: string;
  displayOrder: number;
  behaviorSummary: string;
  interpretation: string;
}

export interface PensionPassport {
  passportId: number;
  type: CodeDisplay;
  typeDescription: string;
  sustainableMonthlyContribution: number;
  biggestInterruptionRisk: CodeDisplay;
  marketRiskLevel: CodeDisplay;
  summary: string;
  judgmentReason: string;
  detailedAnalysis: PensionPassportDetail[];
  createdAt: string;
}

interface PensionPassportResponse {
  code: string;
  message: string;
  data: PensionPassport;
}

// 현재 로그인한 사용자의 연금 패스포트 분석 결과를 조회
export async function getMyPensionPassport() {
  const response = await apiClient.get<PensionPassportResponse>(
    "/api/v1/users/me/pension-passport",
  );

  return response.data.data;
}
