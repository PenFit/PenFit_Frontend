import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icon.png";
import kakaoButton from "../../assets/kakao_button.png";
import Button from "../../components/Button";

export default function Login() {
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAgreementAlert, setShowAgreementAlert] = useState(false);
  const navigate = useNavigate();

  // 동의 전에는 경고 모달을 띄움. 동의 후에는 다음 단계로 이동
  const handleKakaoLogin = () => {
    if (!agreed) {
      setShowAgreementAlert(true);
      return;
    }

    navigate("/step1");
  };

  return (
    <main className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-[oklch(var(--background-50))]">
      {/* 페이지 상단 로고와 안내 문구 영역 */}
      <section className="px-6 pt-20">
        <img src={icon} alt="PenFit" className="mb-7 h-12 w-12 rounded-xl" />

        <h1 className="mb-3 font-heading text-xl font-bold text-[oklch(var(--foreground-950))]">
          시작해볼까요?
        </h1>

        <p className="text-sm text-[oklch(var(--foreground-700))]">
          카카오 계정으로 3초 만에 시작할 수 있어요
        </p>
      </section>

      <div className="flex-1" />

      {/* 하단 로그인 버튼, 약관 동의, 안내 문구 영역 */}
      <section className="flex flex-col gap-4 px-6 pb-8">
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="w-full overflow-hidden rounded-lg transition-opacity active:opacity-90"
          aria-disabled={!agreed}
        >
          <img
            src={kakaoButton}
            alt="카카오로 3초 만에 시작하기"
            className={`w-full ${agreed ? "opacity-100" : "opacity-40"}`}
          />
        </button>

        {/* 카카오 로그인 활성화에 필요한 약관 동의 체크박스 */}
        <div className="flex items-start gap-2">
          <input
            id="agree"
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[oklch(var(--background-300))] accent-[oklch(var(--primary-500))]"
          />
          <label
            htmlFor="agree"
            className="cursor-pointer text-xs leading-relaxed text-[oklch(var(--foreground-700))]"
          >
            서비스 이용약관 및 개인정보 처리에 동의합니다
          </label>
        </div>

        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="w-fit pl-6 text-left text-xs text-[oklch(var(--foreground-600))] underline transition-colors hover:text-[oklch(var(--foreground-800))]"
        >
          약관 자세히 보기
        </button>

        {/* 실제 금융상품 가입이 아닌 가상 체험임을 알리는 문구 */}
        <p className="pt-3 text-center text-[10px] leading-relaxed text-[oklch(var(--foreground-400))]">
          가상 체험 서비스입니다. 실제 상품 가입은 금융회사 공식 채널에서 진행됩니다.
        </p>
      </section>

      {/* 약관 자세히 보기 바텀시트 모달 */}
      {showTerms && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/40 animate-fade-in">
          <section className="flex max-h-[80%] w-full flex-col rounded-t-2xl bg-[oklch(var(--background-50))] p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-heading text-base font-bold text-[oklch(var(--foreground-950))]">
                서비스 이용약관 및 개인정보 처리방침
              </h2>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-xl text-[oklch(var(--foreground-600))]"
                aria-label="약관 닫기"
              >
                x
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto text-sm leading-relaxed text-[oklch(var(--foreground-700))]">
              <p className="font-semibold text-[oklch(var(--foreground-950))]">제1조 (목적)</p>
              <p>
                본 약관은 PenFit 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리,
                의무 및 책임사항 등을 규정함을 목적으로 합니다.
              </p>
              <p className="font-semibold text-[oklch(var(--foreground-950))]">제2조 (서비스의 성격)</p>
              <p>
                본 서비스는 가상 체험 서비스로, 실제 금융상품 가입을 대행하거나
                중개하지 않습니다. 서비스 내의 모든 연금 시뮬레이션 결과는 참고용입니다.
              </p>
              <p className="font-semibold text-[oklch(var(--foreground-950))]">
                제3조 (개인정보의 수집 및 이용)
              </p>
              <p>
                회사는 서비스 제공을 위해 최소한의 개인정보를 수집하고 수집된
                개인정보는 서비스 제공 목적 외에는 사용되지 않습니다.
              </p>
            </div>

            <Button className="mt-4 py-3" onClick={() => setShowTerms(false)}>
              닫기
            </Button>
          </section>
        </div>
      )}

      {/* 약관 미동의 상태로 로그인 버튼을 눌렀을 때 보여주는 경고 모달 */}
      {showAgreementAlert && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6 animate-fade-in">
          <section className="w-full max-w-sm rounded-lg bg-[oklch(var(--background-50))] p-6 text-center">
            <h2 className="mb-2 font-heading text-base font-bold text-[oklch(var(--foreground-950))]">
              약관 동의가 필요해요
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-[oklch(var(--foreground-700))]">
              카카오로 시작하려면 서비스 이용약관 및 개인정보 처리에 동의해주세요.
            </p>
            <Button className="py-3" onClick={() => setShowAgreementAlert(false)}>
              확인
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}
