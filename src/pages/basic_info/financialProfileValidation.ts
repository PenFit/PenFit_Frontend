export const AGE_BAND_CODES = ['AGE_23_25', 'AGE_26_28', 'AGE_29_31', 'AGE_32_34'];

export const OCCUPATION_TYPE_CODES = [
  'REGULAR_EMPLOYEE',
  'CONTRACT_EMPLOYEE',
  'FREELANCER',
  'SELF_EMPLOYED',
  'PUBLIC_OFFICIAL',
  'UNEMPLOYED',
  'OTHER',
];

export const LIVING_EXPENSE_BAND_CODES = [
  'LIVING_LE_1M',
  'LIVING_GT_1M_LE_1_5M',
  'LIVING_GT_1_5M_LE_2M',
  'LIVING_GT_2M',
];

export const ASSET_BAND_CODES = [
  'ASSET_LT_10M',
  'ASSET_10M_30M',
  'ASSET_30M_50M',
  'ASSET_GE_50M',
];

export const DEBT_BAND_CODES = [
  'DEBT_NONE',
  'DEBT_LT_10M',
  'DEBT_10M_30M',
  'DEBT_GE_30M',
];

export const EMERGENCY_FUND_BAND_CODES = [
  'EMERGENCY_LT_1M',
  'EMERGENCY_1M_3M',
  'EMERGENCY_3M_5M',
  'EMERGENCY_GE_5M',
];

const MAX_FINANCIAL_AMOUNT = 999_999_999_999;

export function isAllowedCode(code: string | undefined, allowedCodes: string[]) {
  return Boolean(code && allowedCodes.includes(code));
}

export function isValidFinancialAmount(amount: number | undefined) {
  return (
    amount !== undefined &&
    Number.isSafeInteger(amount) &&
    amount >= 0 &&
    amount <= MAX_FINANCIAL_AMOUNT
  );
}
