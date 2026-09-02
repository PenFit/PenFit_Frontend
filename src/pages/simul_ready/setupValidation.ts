export const SELECTED_ACCOUNT_STORAGE_KEY = 'selectedPensionAccountType';
export const ACCOUNT_TYPE_CODES_STORAGE_KEY = 'pensionAccountTypeCodes';
export const PREVIEW_STORAGE_KEY = 'pensionSetupPreview';

export const MIN_MONTHLY_CONTRIBUTION_MANWON = 5;
export const MAX_MONTHLY_CONTRIBUTION_MANWON = 1000;

const FALLBACK_ACCOUNT_TYPE_CODES = [
  'PENSION_SAVINGS_FUND',
  'IRP',
  'PENSION_INSURANCE',
];

export function saveAccountTypeCodes(codes: string[]) {
  sessionStorage.setItem(ACCOUNT_TYPE_CODES_STORAGE_KEY, JSON.stringify(codes));
}

export function getAllowedAccountTypeCodes() {
  const storedCodes = sessionStorage.getItem(ACCOUNT_TYPE_CODES_STORAGE_KEY);

  if (!storedCodes) {
    return FALLBACK_ACCOUNT_TYPE_CODES;
  }

  try {
    const parsedCodes = JSON.parse(storedCodes);
    return Array.isArray(parsedCodes) && parsedCodes.every((code) => typeof code === 'string')
      ? parsedCodes
      : FALLBACK_ACCOUNT_TYPE_CODES;
  } catch {
    return FALLBACK_ACCOUNT_TYPE_CODES;
  }
}

export function isAllowedAccountTypeCode(code: string | null | undefined) {
  return Boolean(code && getAllowedAccountTypeCodes().includes(code));
}

export function isValidMonthlyContributionManwon(amount: number) {
  return (
    Number.isSafeInteger(amount) &&
    amount >= MIN_MONTHLY_CONTRIBUTION_MANWON &&
    amount <= MAX_MONTHLY_CONTRIBUTION_MANWON
  );
}
