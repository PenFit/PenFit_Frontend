import type { CreateFinancialProfileRequest } from '../../apis/financial';

// Step1~3에서 나눠 입력한 금융정보를 임시 저장하는 sessionStorage key
const STORAGE_KEY = 'financialProfileDraft';

// 마지막 등록 전까지 일부 값만 저장될 수 있으므로 Partial 타입 사용
type FinancialProfileDraft = Partial<CreateFinancialProfileRequest>;

// 현재까지 저장된 금융정보 임시값을 조회
export function getFinancialProfileDraft(): FinancialProfileDraft {
  const storedDraft = sessionStorage.getItem(STORAGE_KEY);

  if (!storedDraft) {
    return {};
  }

  try {
    return JSON.parse(storedDraft) as FinancialProfileDraft;
  } catch {
    return {};
  }
}

// 새로 입력한 단계의 값을 기존 임시값과 합쳐 저장
export function saveFinancialProfileDraft(draft: FinancialProfileDraft) {
  const nextDraft = {
    ...getFinancialProfileDraft(),
    ...draft,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
}

// 금융정보 등록이 끝나면 임시값 제거
export function clearFinancialProfileDraft() {
  sessionStorage.removeItem(STORAGE_KEY);
}
