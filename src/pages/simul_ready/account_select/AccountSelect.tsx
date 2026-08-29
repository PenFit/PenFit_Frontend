import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPensionAccountTypes, type PensionAccountType } from '../../../apis/setup';
import ProgressBar from '../../../components/ProgressBar';
import AccountCard from '../../../components/AccountCard';

export default function AccountSelect() {
  const navigate = useNavigate();

  const [accountTypes, setAccountTypes] = useState<PensionAccountType[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const pensionAccountTypes = await getPensionAccountTypes();
        setAccountTypes(pensionAccountTypes);
      } catch (error) {
        console.error('연금계좌 종류 조회에 실패했어요.', error);
        setErrorMessage('계좌 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountTypes();
  }, []);

  const handleStartWithAccount = () => {
    if (!selectedAccount) {
      return;
    }

    sessionStorage.setItem('selectedPensionAccountType', selectedAccount);
    navigate('/amount-input', { state: { accountType: selectedAccount } });
  };

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
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm font-semibold text-foreground-500">
                계좌 정보를 불러오는 중이에요
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

          {!isLoading && !errorMessage && accountTypes.map((accountType) => (
            <AccountCard
              key={accountType.code}
              title={accountType.title}
              subtitle={accountType.name}
              description={accountType.description}
              tags={accountType.tags}
              selected={selectedAccount === accountType.code}
              onClick={() => setSelectedAccount(accountType.code)}
            />
          ))}

          {/* 비교 링크 */}
          {!isLoading && !errorMessage && (
            <button
              type="button"
              onClick={() => navigate('/account-select/compare')}
              className="w-full text-center py-3 text-sm text-foreground-500 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              <i className="ri-exchange-line w-4 h-4 inline-flex items-center justify-center mr-1" />
              새 계좌 한눈에 비교하기
            </button>
          )}
        </div>

        {/* 시작 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={handleStartWithAccount}
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
