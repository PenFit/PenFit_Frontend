import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../components/Button";
import { loginWithKakaoCode, saveAuthSession } from "../../../apis/auth";

// 같은 카카오 인가 code로 로그인 API가 중복 호출되지 않도록 기록
const requestedCodes = new Set<string>();

function getInitialErrorMessage(code: string | null, state: string | null) {
  if (!code) {
    return "카카오 인가 코드를 찾을 수 없어요.";
  }

  const savedState = sessionStorage.getItem("kakao-oauth-state");

  if (!state || !savedState || state !== savedState) {
    return "로그인 요청 정보를 확인할 수 없어요. 다시 시도해주세요.";
  }

  return "";
}

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedCodeRef = useRef<string | null>(null);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [errorMessage, setErrorMessage] = useState(() =>
    getInitialErrorMessage(code, state),
  );

  useEffect(() => {
    if (errorMessage) {
      sessionStorage.removeItem("kakao-oauth-state");
      return;
    }

    if (!code) {
      return;
    }

    const storageKey = `kakao-login-requested:${code}`;

    // 카카오 인가 code는 1회용이므로 같은 code 요청은 건너뜀
    if (
      requestedCodeRef.current === code ||
      requestedCodes.has(code) ||
      sessionStorage.getItem(storageKey)
    ) {
      return;
    }

    requestedCodeRef.current = code;
    requestedCodes.add(code);
    sessionStorage.setItem(storageKey, "true");

    const requestLogin = async () => {
      try {
        // 백엔드에 code를 전달해 서비스 accessToken을 발급받음
        const authData = await loginWithKakaoCode(code);
        saveAuthSession(authData);
        sessionStorage.removeItem("kakao-oauth-state");
        navigate(authData.newUser ? "/step1" : "/home", { replace: true });
      } catch {
        sessionStorage.removeItem("kakao-oauth-state");
        setErrorMessage("카카오 로그인에 실패했어요. 다시 시도해주세요.");
      }
    };

    requestLogin();
  }, [code, errorMessage, navigate]);

  // 로그인 실패 또는 code 누락 시 보여주는 오류 화면
  if (errorMessage) {
    return (
      <main className="flex h-full min-h-0 flex-col items-center justify-center bg-background-50 px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
          <i className="ri-error-warning-line flex h-7 w-7 items-center justify-center text-2xl text-accent-600" />
        </div>
        <h1 className="mb-2 font-heading text-lg font-bold text-foreground-950">
          로그인을 완료하지 못했어요
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-foreground-600">
          {errorMessage}
        </p>
        <Button onClick={() => navigate("/login", { replace: true })}>
          로그인으로 돌아가기
        </Button>
      </main>
    );
  }

  // 백엔드 로그인 요청이 끝날 때까지 보여주는 로딩 화면
  return (
    <main className="flex h-full min-h-0 flex-col items-center justify-center bg-background-50 px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
        <i className="ri-loader-4-line flex h-7 w-7 animate-spin items-center justify-center text-2xl text-primary-600" />
      </div>
      <h1 className="mb-2 font-heading text-lg font-bold text-foreground-950">
        카카오 로그인 중이에요
      </h1>
      <p className="text-sm leading-relaxed text-foreground-600">
        잠시만 기다려주세요.
      </p>
    </main>
  );
}
