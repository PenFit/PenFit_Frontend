import { useNavigate } from 'react-router-dom';

const accounts = [
  {
    key: 'dc',
    shortName: '직장인자유연금',
    type: '연금저축펀드',
    icon: 'ri-briefcase-4-line',
  },
  {
    key: 'irp',
    shortName: '국민연금 IRP',
    type: '퇴직연금 IRP',
    icon: 'ri-building-2-line',
  },
  {
    key: 'insurance',
    shortName: '근금연금보험',
    type: '연금보험',
    icon: 'ri-shield-check-line',
  },
];

const criteria = [
  {
    key: 'invest',
    label: '투자 방식',
    values: ['ETF·펀드를 직접 골라 투자', '퇴직금 + 개인 납입을 한 계좌로 관리', '정해진 방식으로 매달 꾸준히 납입'],
  },
  {
    key: 'tax',
    label: '세제 혜택',
    values: ['연 최대 900만원 (700+200)', '연 최대 900만원 + 퇴직금 이연 과세', '연 최대 400만원'],
  },
  {
    key: 'feature',
    label: '핵심 특징',
    values: ['자산 배분을 자유롭게 조절', '퇴직금 관리 효율성 ↑', '안정적인 수익률에 중점'],
  },
  {
    key: 'fit',
    label: '추천 대상',
    values: ['투자를 직접 해보고 싶은 분', '퇴직금을 한곳에 모아 보고 싶은 분', '꾸준하고 안전하게 모으고 싶은 분'],
  },
];

export default function AccountCompare() {
  const navigate = useNavigate();

  return (
    <>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-foreground-500 mb-3 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-s-line" />
            계좌 선택으로 돌아가기
          </button>
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            새 계좌 한눈에 비교
          </h1>
          <p className="text-sm text-foreground-500">
            가장 중요한 기준 먼저 보여드려요
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
          {/* Compare Table */}
          <div className="bg-background-50 border border-background-200 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-background-200">
              <div className="p-3 text-xs font-semibold text-foreground-500 flex items-center justify-center bg-background-100">
                비교 기준
              </div>
              {accounts.map((acc, idx) => (
                <div
                  key={acc.key}
                  className={`
                    p-3 flex flex-col items-center justify-center gap-1
                    ${idx === 0 ? 'bg-primary-50' : 'bg-background-100'}
                  `}
                >
                  <i className={`${acc.icon} text-base flex items-center justify-center ${idx === 0 ? 'text-primary-500' : 'text-foreground-400'}`} />
                  <span className={`text-xs font-bold ${idx === 0 ? 'text-primary-700' : 'text-foreground-700'}`}>
                    {acc.shortName}
                  </span>
                  <span className="text-[10px] text-foreground-500">
                    {acc.type}
                  </span>
                </div>
              ))}
            </div>

            {/* Criteria Rows */}
            {criteria.map((c) => (
              <div
                key={c.key}
                className="grid grid-cols-4 border-b border-background-200 last:border-b-0"
              >
                <div className="p-3 text-xs font-semibold text-foreground-600 flex items-start bg-background-100 leading-relaxed">
                  {c.label}
                </div>
                {c.values.map((val, idx) => (
                  <div
                    key={idx}
                    className={`
                      p-3 text-[11px] text-foreground-700 text-center leading-relaxed
                      ${idx === 0 ? 'bg-primary-50' : 'bg-background-100'}
                    `}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 px-1">
            <span className="w-3 h-3 rounded-sm bg-primary-50 border border-primary-200" />
            <span className="text-[11px] text-foreground-500">첫 번째 계좌 (직장인자유연금)가 강조된 비교예요</span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-foreground-400 leading-relaxed bg-background-100 rounded-lg p-3">
            세부 조건과 자격 요건은 상품 가입 전 금융회사 공식 채널에서 확인이 필요해요.
          </p>
        </div>

        {/* Bottom Button */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/account-select')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            계좌 선택으로 돌아가기
          </button>
        </div>
    </>
  );
}