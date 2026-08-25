import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';

const expenseOptions = [
  { value: 'under100', label: '100만원 이하', icon: 'ri-restaurant-line' },
  { value: '100to150', label: '100 ~ 150만원', icon: 'ri-restaurant-line' },
  { value: '150to200', label: '150 ~ 200만원', icon: 'ri-restaurant-line' },
  { value: 'over200', label: '200만원 이상', icon: 'ri-restaurant-line' },
];

const assetOptions = [
  { value: 'under1000', label: '1,000만원 미만', icon: 'ri-wallet-3-line' },
  { value: '1000to3000', label: '1,000 ~ 3,000만원', icon: 'ri-wallet-3-line' },
  { value: '3000to5000', label: '3,000 ~ 5,000만원', icon: 'ri-wallet-3-line' },
  { value: 'over5000', label: '5,000만원 이상', icon: 'ri-wallet-3-line' },
];

const debtOptions = [
  { value: 'none', label: '없음', icon: 'ri-shield-check-line' },
  { value: 'under1000', label: '1,000만원 미만', icon: 'ri-alert-line' },
  { value: '1000to3000', label: '1,000 ~ 3,000만원', icon: 'ri-alert-line' },
  { value: 'over3000', label: '3,000만원 이상', icon: 'ri-alert-line' },
];

export default function Step2() {
  const navigate = useNavigate();

  const [expense, setExpense] = useState<string>('');
  const [asset, setAsset] = useState<string>('');
  const [debt, setDebt] = useState<string>('');

  const allSelected = expense && asset && debt;

  return (
    <>
        <ProgressBar current={2} total={3} />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            생활비와 자산 상황을 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            정확한 시뮬레이션을 위해 필요해요
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* Expense Section */}
          <div>
            <SectionTitle title="월 생활비" />
            <div className="space-y-2">
              {expenseOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={expense === opt.value}
                  onClick={() => setExpense(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Asset Section */}
          <div>
            <SectionTitle title="현재 자산" />
            <div className="space-y-2">
              {assetOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={asset === opt.value}
                  onClick={() => setAsset(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Debt Section */}
          <div>
            <SectionTitle title="부채" />
            <div className="space-y-2">
              {debtOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={debt === opt.value}
                  onClick={() => setDebt(opt.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/step3')}
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