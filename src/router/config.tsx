import type { RouteObject } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import NotFound from "../pages/NotFound";
import Login from "../pages/login/Login";
import Splash from "../pages/splash/Splash";
import Step1 from "../pages/basic_info/Step1";
import Step2 from "../pages/basic_info/Step2";
import Step3 from "../pages/basic_info/Step3";
import AccountSelect from "../pages/simul_ready/account_select/AccountSelect";
import AccountCompare from "../pages/simul_ready/account_select/compare/AccountCompare";
import AmountInput from "../pages/simul_ready/amount_input/AmountInput";
import ResultPreview from "../pages/simul_ready/result_preview/ResultPreview";

// 앱에서 사용할 URL 경로와 각 경로에 보여줄 페이지 컴포넌트를 정의
const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Splash /> },
      { path: "/login", element: <Login /> },
      { path: "/step1", element: <Step1 />},
      { path: "/step2", element: <Step2 />},
      { path: "/step3", element: <Step3 />},
      { path: "/account-select", element: <AccountSelect />},
      { path: "/account-select/compare", element: <AccountCompare />},
      { path: "/amount-input", element: <AmountInput />},
      { path: "/result-preview", element: <ResultPreview />},
    ],
  },
  {
    path: "*", element: <NotFound />,
  }
];

export default routes;
