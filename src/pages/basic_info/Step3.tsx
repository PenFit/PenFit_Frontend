import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';
import MoneyInput from '../../components/MoneyInput';

const emergencyOptions = [
  { value: 'under100', label: '100만원 미만', icon: 'ri-first-aid-kit-line' },
  { value: '100to300', label: '100 ~ 300만원', icon: 'ri-first-aid-kit-line' },
  { value: '300to500', label: '300 ~ 500만원', icon: 'ri-first-aid-kit-line' },
  { value: 'over500', label: '500만원 이상', icon: 'ri-first-aid-kit-line' },
];

export default function Step3() {
  const navigate = useNavigate();

  const [emergency, setEmergency] = useState<string>('');
  const [savings, setSavings] = useState<string>('');
  const [invest, setInvest] = useState<string>('');

  const allSelected = emergency && savings && invest;

  return (
    <>
        <ProgressBar current={3} total={3} />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            비상 자금과 투자 현황을 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            리스크 관리 능력을 파악하는 질문이에요
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* Emergency Section */}
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

          {/* Savings Section */}
          <div>
            <SectionTitle title="저축 금액 (월)" />
            <MoneyInput
              value={savings}
              onChange={setSavings}
              placeholder="한 달 저축 금액을 입력하세요"
              icon="ri-safe-line"
              suffix="만원"
            />
          </div>

          {/* Invest Section */}
          <div>
            <SectionTitle title="현재 투자 금액" />
            <MoneyInput
              value={invest}
              onChange={setInvest}
              placeholder="현재 투자 금액을 입력하세요"
              icon="ri-line-chart-line"
              suffix="만원"
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/account-select')}
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