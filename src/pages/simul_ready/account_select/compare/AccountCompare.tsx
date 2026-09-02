import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPensionAccountTypes, type PensionAccountType } from '../../../../apis/setup';
import { saveAccountTypeCodes } from '../../setupValidation';

const accountIcons = ['ri-briefcase-4-line', 'ri-building-2-line', 'ri-shield-check-line'];

const comparisonRows = [
  {
    key: 'investmentStyle',
    label: '투자 방식',
    getValue: (accountType: PensionAccountType) => accountType.comparison.investmentStyle,
  },
  {
    key: 'taxBenefit',
    label: '세제 혜택',
    getValue: (accountType: PensionAccountType) => accountType.comparison.taxBenefit,
  },
  {
    key: 'keyFeature',
    label: '핵심 특징',
    getValue: (accountType: PensionAccountType) => accountType.comparison.keyFeature,
  },
  {
    key: 'recommendedFor',
    label: '추천 대상',
    getValue: (accountType: PensionAccountType) => accountType.comparison.recommendedFor,
  },
];

export default function AccountCompare() {
  const navigate = useNavigate();
  const [accountTypes, setAccountTypes] = useState<PensionAccountType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const pensionAccountTypes = await getPensionAccountTypes();
        setAccountTypes(pensionAccountTypes);
        saveAccountTypeCodes(pensionAccountTypes.map((accountType) => accountType.code));
      } catch (error) {
        console.error('연금계좌 비교 정보 조회에 실패했어요.', error);
        setErrorMessage('계좌 비교 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountTypes();
  }, []);

  const gridTemplateColumns = useMemo(
    () => `minmax(72px, 0.8fr) repeat(${accountTypes.length}, minmax(84px, 1fr))`,
    [accountTypes.length],
  );

  return (
    <>
        {/* 헤더 */}
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

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm font-semibold text-foreground-500">
                계좌 비교 정보를 불러오는 중이에요
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <i className="ri-error-warning-line flex h-6 w-6 items-center justify-center text-xl text-accent-600" />
              </div>
              <p className="text-sm font-semibold text-foreground-700">
                {errorMessage}
              </p>
            </div>
          )}

          {!isLoading && !errorMessage && accountTypes.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-foreground-700">
                비교할 계좌 정보가 없어요.
              </p>
            </div>
          )}

          {!isLoading && !errorMessage && accountTypes.length > 0 && (
            <>
              {/* 비교 테이블 */}
              <div className="overflow-x-auto rounded-xl border border-background-200 bg-background-50">
                <div className="min-w-120">
                  {/* 테이블 헤더 */}
                  <div
                    className="grid border-b border-background-200"
                    style={{ gridTemplateColumns }}
                  >
                    <div className="p-3 text-xs font-semibold text-foreground-500 flex items-center justify-center bg-background-100">
                      비교 기준
                    </div>
                    {accountTypes.map((accountType, index) => (
                      <div
                        key={accountType.code}
                        className={`
                          p-3 flex flex-col items-center justify-center gap-1
                          ${index === 0 ? 'bg-primary-50' : 'bg-background-100'}
                        `}
                      >
                        <i className={`${accountIcons[index % accountIcons.length]} text-base flex items-center justify-center ${index === 0 ? 'text-primary-500' : 'text-foreground-400'}`} />
                        <span className={`text-xs font-bold ${index === 0 ? 'text-primary-700' : 'text-foreground-700'}`}>
                          {accountType.title}
                        </span>
                        <span className="text-[10px] text-foreground-500">
                          {accountType.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 비교 항목 */}
                  {comparisonRows.map((row) => (
                    <div
                      key={row.key}
                      className="grid border-b border-background-200 last:border-b-0"
                      style={{ gridTemplateColumns }}
                    >
                      <div className="p-3 text-xs font-semibold text-foreground-600 flex items-start bg-background-100 leading-relaxed">
                        {row.label}
                      </div>
                      {accountTypes.map((accountType, index) => (
                        <div
                          key={accountType.code}
                          className={`
                            p-3 text-[11px] text-foreground-700 text-center leading-relaxed
                            ${index === 0 ? 'bg-primary-50' : 'bg-background-100'}
                          `}
                        >
                          {row.getValue(accountType)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 강조 안내 */}
              <div className="flex items-center gap-2 px-1">
                <span className="w-3 h-3 rounded-sm bg-primary-50 border border-primary-200" />
                <span className="text-[11px] text-foreground-500">
                  첫 번째 계좌 ({accountTypes[0].title})가 강조된 비교예요
                </span>
              </div>

              {/* 유의사항 */}
              <p className="text-xs text-foreground-400 leading-relaxed bg-background-100 rounded-lg p-3">
                세부 조건과 자격 요건은 상품 가입 전 금융회사 공식 채널에서 확인이 필요해요.
              </p>
            </>
          )}
        </div>

        {/* 하단 버튼 */}
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
