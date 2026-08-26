import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../components/ProgressBar';
import AccountCard from '../../../components/AccountCard';

const accountOptions = [
  {
    value: 'dc',
    title: '직접 기유는 연금',
    subtitle: '근금자유연금',
    description: 'ETF와 펀드를 직접 선택해 투자해요',
    tags: ['퇴직연금전용', '세제혜택가능', '자산배분전략', '장기투자효과'],
  },
  {
    value: 'irp',
    title: '퇴직금과 함께 모으는 연금',
    subtitle: '국민연금 IRP',
    description: '퇴직금과 함께 나란금을 한 계좌에서 관리해요',
    tags: ['퇴직연금전용', '자산관리효율성', '복잡성보다', '퇴직금과 연계'],
  },
  {
    value: 'insurance',
    title: '꾸준히 받는 보험형 연금',
    subtitle: '근금연금보험',
    description: '정해진 방식에 따라 매달 꾸준히 들어가요',
    tags: ['정기납입보장형상품', '안정성가중비중', '안정적인수익률'],
  },
];

export default function AccountSelect() {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState<string>('');

  return (
    <>
        <ProgressBar current={1} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            어떤 계좌로 리허설할까요?
          </h1>
          <p className="text-sm text-foreground-500">
            세 개의 계좌를 확인하고 하나를 골라주세요
          </p>
        </div>

        {/* 계좌 선택 박스 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
          {accountOptions.map((opt) => (
            <AccountCard
              key={opt.value}
              title={opt.title}
              subtitle={opt.subtitle}
              description={opt.description}
              tags={opt.tags}
              selected={selectedAccount === opt.value}
              onClick={() => setSelectedAccount(opt.value)}
            />
          ))}

          {/* 비교 링크 */}
          <button
            type="button"
            onClick={() => navigate('/account-select/compare')}
            className="w-full text-center py-3 text-sm text-foreground-500 hover:text-primary-600 transition-colors whitespace-nowrap"
          >
            <i className="ri-exchange-line w-4 h-4 inline-flex items-center justify-center mr-1" />
            새 계좌 한눈에 비교하기
          </button>
        </div>

        {/* 시작 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/amount-input')}
            disabled={!selectedAccount}
            className={`
              w-full font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
              ${selectedAccount
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }
            `}
          >
            이 계좌로 시작하기
          </button>
        </div>
    </>
  );
}