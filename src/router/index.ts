import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import routes from "./config";

// 컴포넌트 밖에서도 navigate를 사용할 수 있도록 Promise resolver를 보관
let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    // 디버깅이나 외부 모듈에서 라우터 이동 함수를 참조할 수 있게 window에 노출
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

// AppRoutes가 렌더링되어 navigate 함수가 준비되면 resolve되는 Promise
export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  // config.tsx에 정의된 routes를 현재 URL에 맞는 React element로 변환
  const element = useRoutes(routes);
  const navigate = useNavigate();

  // useNavigate로 얻은 이동 함수를 전역과 Promise에 연결
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  }, [navigate]);

  return element;
}
