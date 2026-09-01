import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';
import MoneyInput from '../../components/MoneyInput';
import { createMyFinancialProfile, type CreateFinancialProfileRequest } from '../../apis/financial';
import { clearFinancialProfileDraft, getFinancialProfileDraft } from './financialProfileDraft';

const emergencyOptions = [
  { value: 'EMERGENCY_LT_1M', label: '100만원 미만', icon: 'ri-first-aid-kit-line' },
  { value: 'EMERGENCY_1M_3M', label: '100 ~ 300만원', icon: 'ri-first-aid-kit-line' },
  { value: 'EMERGENCY_3M_5M', label: '300 ~ 500만원', icon: 'ri-first-aid-kit-line' },
  { value: 'EMERGENCY_GE_5M', label: '500만원 이상', icon: 'ri-first-aid-kit-line' },
];

export default function Step3() {
  const navigate = useNavigate();

  const [emergency, setEmergency] = useState<string>('');
  const [savings, setSavings] = useState<string>('');
  const [invest, setInvest] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSelected = emergency && savings && invest;

  const handleSubmit = async () => {
    if (!allSelected || isSubmitting) {
      return;
    }

    const draft = getFinancialProfileDraft();

    if (
      !draft.ageBand ||
      !draft.occupationType ||
      draft.monthlySalary === undefined ||
      !draft.livingExpenseBand ||
      !draft.assetBand ||
      !draft.debtBand
    ) {
      navigate('/step1', { replace: true });
      return;
    }

    setIsSubmitting(true);

    const financialProfile: CreateFinancialProfileRequest = {
      ageBand: draft.ageBand,
      occupationType: draft.occupationType,
      monthlySalary: draft.monthlySalary,
      livingExpenseBand: draft.livingExpenseBand,
      assetBand: draft.assetBand,
      debtBand: draft.debtBand,
      emergencyFundBand: emergency,
      monthlySavings: Number(savings),
      currentInvestment: Number(invest),
    };

    try {
      console.log('금융정보 등록 요청', financialProfile);
      await createMyFinancialProfile(financialProfile);
      clearFinancialProfileDraft();
      navigate('/account-select');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('금융정보 등록 실패 응답', error.response?.data);
      }
      console.error('금융정보 등록에 실패했어요.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <ProgressBar current={3} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            비상 자금과 투자 현황을 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            리스크 관리 능력을 파악하는 질문이에요
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* 비상금 섹션 */}
          <div>
            <SectionTitle title="비상금" />
            <div className="space-y-2">
              {emergencyOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={emergency === opt.value}
                  onClick={() => setEmergency(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* 저축 금액 섹션 */}
          <div>
            <SectionTitle title="저축 금액 (월)" />
            <MoneyInput
              value={savings}
              onChange={setSavings}
              placeholder="한 달 저축 금액을 원 단위로 입력하세요"
              icon="ri-safe-line"
              suffix="원"
            />
          </div>

          {/* 투자 금액 섹션 */}
          <div>
            <SectionTitle title="현재 투자 금액" />
            <MoneyInput
              value={invest}
              onChange={setInvest}
              placeholder="현재 투자 금액을 원 단위로 입력하세요"
              icon="ri-line-chart-line"
              suffix="원"
            />
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allSelected || isSubmitting}
            className={`
              w-full font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
              ${allSelected && !isSubmitting
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? '등록 중' : '다음'}
          </button>
        </div>
    </>
  );
}
