import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';
import { saveFinancialProfileDraft } from './financialProfileDraft';
import {
  ASSET_BAND_CODES,
  DEBT_BAND_CODES,
  LIVING_EXPENSE_BAND_CODES,
  isAllowedCode,
} from './financialProfileValidation';

const expenseOptions = [
  { value: 'LIVING_LE_1M', label: '100만원 이하', icon: 'ri-restaurant-line' },
  { value: 'LIVING_GT_1M_LE_1_5M', label: '100 ~ 150만원', icon: 'ri-restaurant-line' },
  { value: 'LIVING_GT_1_5M_LE_2M', label: '150 ~ 200만원', icon: 'ri-restaurant-line' },
  { value: 'LIVING_GT_2M', label: '200만원 이상', icon: 'ri-restaurant-line' },
];

const assetOptions = [
  { value: 'ASSET_LT_10M', label: '1,000만원 미만', icon: 'ri-wallet-3-line' },
  { value: 'ASSET_10M_30M', label: '1,000 ~ 3,000만원', icon: 'ri-wallet-3-line' },
  { value: 'ASSET_30M_50M', label: '3,000 ~ 5,000만원', icon: 'ri-wallet-3-line' },
  { value: 'ASSET_GE_50M', label: '5,000만원 이상', icon: 'ri-wallet-3-line' },
];

const debtOptions = [
  { value: 'DEBT_NONE', label: '없음', icon: 'ri-shield-check-line' },
  { value: 'DEBT_LT_10M', label: '1,000만원 미만', icon: 'ri-alert-line' },
  { value: 'DEBT_10M_30M', label: '1,000 ~ 3,000만원', icon: 'ri-alert-line' },
  { value: 'DEBT_GE_30M', label: '3,000만원 이상', icon: 'ri-alert-line' },
];

export default function Step2() {
  const navigate = useNavigate();

  const [expense, setExpense] = useState<string>('');
  const [asset, setAsset] = useState<string>('');
  const [debt, setDebt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const allSelected = expense && asset && debt;

  const handleNext = () => {
    if (!allSelected) {
      return;
    }

    if (
      !isAllowedCode(expense, LIVING_EXPENSE_BAND_CODES) ||
      !isAllowedCode(asset, ASSET_BAND_CODES) ||
      !isAllowedCode(debt, DEBT_BAND_CODES)
    ) {
      setErrorMessage('선택한 정보를 다시 확인해주세요.');
      return;
    }

    saveFinancialProfileDraft({
      livingExpenseBand: expense,
      assetBand: asset,
      debtBand: debt,
    });
    navigate('/step3');
  };

  return (
    <>
        <ProgressBar current={2} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            생활비와 자산 상황을 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            정확한 시뮬레이션을 위해 필요해요
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* 월 생활비 섹션 */}
          <div>
            <SectionTitle title="월 생활비" />
            <div className="space-y-2">
              {expenseOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={expense === opt.value}
	                  onClick={() => {
                      setExpense(opt.value);
                      setErrorMessage('');
                    }}
                />
              ))}
            </div>
          </div>

          {/* 현재 자산 섹션 */}
          <div>
            <SectionTitle title="현재 자산" />
            <div className="space-y-2">
              {assetOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={asset === opt.value}
	                  onClick={() => {
                      setAsset(opt.value);
                      setErrorMessage('');
                    }}
                />
              ))}
            </div>
          </div>

          {/* 부채 섹션 */}
          <div>
            <SectionTitle title="부채" />
            <div className="space-y-2">
              {debtOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={debt === opt.value}
	                  onClick={() => {
                      setDebt(opt.value);
                      setErrorMessage('');
                    }}
                />
              ))}
	          </div>
            {errorMessage && (
              <p className="text-sm font-semibold text-accent-600">
                {errorMessage}
              </p>
            )}
	        </div>
        </div>

        {/* 다음 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={handleNext}
            disabled={!allSelected}
            className={`
              w-full font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
              ${allSelected
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }
            `}
          >
            다음
          </button>
        </div>
    </>
  );
}
