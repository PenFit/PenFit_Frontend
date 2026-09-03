export const AI_ERROR_CODES = {
  TOO_MANY_REQUESTS: 'AI4291',
  DAILY_LIMIT_EXCEEDED: 'AI4292',
  TIMEOUT: 'AI5041',
  SERVER_ERROR: 'AI5022',
} as const;

export type AiErrorCode = (typeof AI_ERROR_CODES)[keyof typeof AI_ERROR_CODES];

interface AiErrorPolicy {
  loadingMessage?: string;
  loadingDescription?: string;
  errorDescription: string;
  retryDelaySeconds: number;
  showRetryButton: boolean;
}

const AI_ERROR_POLICIES: Record<AiErrorCode, AiErrorPolicy> = {
  [AI_ERROR_CODES.TOO_MANY_REQUESTS]: {
    loadingMessage: '분석을 마무리하고 있어요',
    loadingDescription: '조금만 기다려주세요',
    errorDescription: '지금 분석 요청이 몰려 있어요\n1분 뒤에 다시 시도해주세요',
    retryDelaySeconds: 60,
    showRetryButton: true,
  },
  [AI_ERROR_CODES.TIMEOUT]: {
    loadingMessage: '분석을 마무리하고 있어요',
    loadingDescription: '조금만 기다려주세요',
    errorDescription: '분석이 예상보다 오래 걸리고 있어요\n잠시 후 다시 시도해주세요',
    retryDelaySeconds: 30,
    showRetryButton: true,
  },
  [AI_ERROR_CODES.DAILY_LIMIT_EXCEEDED]: {
    errorDescription:
      '오늘 이용할 수 있는 분석 횟수를 모두 사용했어요\n내일 오전 9시 이후에 다시 이용하실 수 있어요\n이미 만들어진 분석 결과는 그대로 확인하실 수 있어요',
    retryDelaySeconds: 0,
    showRetryButton: false,
  },
  [AI_ERROR_CODES.SERVER_ERROR]: {
    loadingMessage: '분석을 마무리하고 있어요',
    loadingDescription: '조금만 기다려주세요',
    errorDescription: '분석 중 문제가 생겼어요\n다시 시도해주세요',
    retryDelaySeconds: 0,
    showRetryButton: true,
  },
};

export function getAiErrorPolicy(code?: string) {
  return AI_ERROR_POLICIES[code as AiErrorCode];
}

export function shouldAutoRetryAiError(code?: string) {
  return (
    code === AI_ERROR_CODES.TOO_MANY_REQUESTS ||
    code === AI_ERROR_CODES.TIMEOUT ||
    code === AI_ERROR_CODES.SERVER_ERROR
  );
}
