import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPensionSetup } from '../../../apis/setup';
import ProgressBar from '../../../components/ProgressBar';
import AmountSlider from '../../../components/AmountSlider';
import {
  MAX_MONTHLY_CONTRIBUTION_MANWON,
  MIN_MONTHLY_CONTRIBUTION_MANWON,
  PREVIEW_STORAGE_KEY,
  SELECTED_ACCOUNT_STORAGE_KEY,
  isAllowedAccountTypeCode,
  isValidMonthlyContributionManwon,
} from '../setupValidation';

interface AmountInputLocationState {
  accountType?: string;
}

export default function AmountInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as AmountInputLocationState | null;

  const [amount, setAmount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedAccountType =
    locationState?.accountType ?? sessionStorage.getItem(SELECTED_ACCOUNT_STORAGE_KEY);

  const handlePreview = async () => {
    if (isSubmitting) {
      return;
    }

    if (!isAllowedAccountTypeCode(selectedAccountType)) {
      navigate('/account-select', { replace: true });
      return;
    }
    const accountType = selectedAccountType ?? '';

    if (!isValidMonthlyContributionManwon(amount)) {
      setErrorMessage(
        `월 납입 금액은 ${MIN_MONTHLY_CONTRIBUTION_MANWON}만원 이상 ${MAX_MONTHLY_CONTRIBUTION_MANWON.toLocaleString('ko-KR')}만원 이하로 입력해주세요.`,
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const pensionSetup = await createPensionSetup({
        accountType,
        monthlyContribution: amount * 10000,
      });

      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(pensionSetup));
      navigate('/result-preview');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('연금 설정 등록 실패 응답', error.response?.data);
      }
      console.error('연금 설정 등록에 실패했어요.', error);
      setErrorMessage('연금 설정을 등록하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (nextAmount: number) => {
    setAmount(nextAmount);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <>
        <ProgressBar current={2} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            연금 계좌에 얼마를 넣을까요?
          </h1>
          <p className="text-sm text-foreground-500">
            월 납입 금액을 선택하거나 직접 입력해주세요
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 flex flex-col px-6 pt-4 pb-4">
          <AmountSlider
            value={amount}
            onChange={handleAmountChange}
            min={MIN_MONTHLY_CONTRIBUTION_MANWON}
            max={100}
            step={5}
            inputMax={MAX_MONTHLY_CONTRIBUTION_MANWON}
          />

          {errorMessage && (
            <p className="mt-3 text-sm font-medium text-accent-600">
              {errorMessage}
            </p>
          )}

          {/* 정보 카드 */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 p-4 bg-background-100 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <i className="ri-calendar-line text-primary-600 w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground-950">매월 꾸준히</p>
                <p className="text-xs text-foreground-500">{amount}만원씩 30년간 납입</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background-100 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                <i className="ri-percent-line text-accent-600 w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground-950">예상 수익률</p>
                <p className="text-xs text-foreground-500">연 5% 가정 (변동 가능)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 미리보기 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isSubmitting}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-4 rounded-lg transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '등록 중' : '결과 미리보기'}
          </button>
        </div>
    </>
  );
}
