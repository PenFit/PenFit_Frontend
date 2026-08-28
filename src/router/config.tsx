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
import Simulation from "../pages/simulation/SImulation";
import Loading from "../pages/simulation/loading/Loading";
import Home from "../pages/home/Home";
import RecommendMain from "../pages/recommend/Recommend";
import RecommendStart from "../pages/recommend/start/RecommendStart";
import RecommendDetail from "../pages/recommend/detail/RecommendDetail";
import RecommendCompare from "../pages/recommend/compare/RecommendCompare";
import Mission from "../pages/mission/Mission";
import MissionAnalysis from "../pages/mission/analysis/MissionAnalysis";
import MissionWeekly from "../pages/mission/weekly/MissionWeekly";
import MissionComplete from "../pages/mission/complete/MissionComplete";
import Passport from "../pages/passport/Passport";
import PlanResult from "../pages/plan_result/PlanResult";
import MyPage from "../pages/mypage/MyPage";
import MyInfo from "../pages/mypage/my_info/MyInfo";
import StatusSuccess from "../pages/status/Success";
import StatusError from "../pages/status/Error";
import StatusEmpty from "../pages/status/Empty";
import KakaoCallback from "../pages/oauth/kakao/KakaoCallback";

// 앱에서 사용할 URL 경로와 각 경로에 보여줄 페이지 컴포넌트를 정의
const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Splash /> },
      { path: "/login", element: <Login /> },
      { path: "/oauth/kakao/callback", element: <KakaoCallback /> },
      { path: "/step1", element: <Step1 />},
      { path: "/step2", element: <Step2 />},
      { path: "/step3", element: <Step3 />},
      { path: "/account-select", element: <AccountSelect />},
      { path: "/account-select/compare", element: <AccountCompare />},
      { path: "/amount-input", element: <AmountInput />},
      { path: "/result-preview", element: <ResultPreview />},
      { path: "/simulation/:step", element: <Simulation />},
      { path: "/loading", element: <Loading />},
      { path: "/home", element: <Home />},
      { path: "/recommend", element: <RecommendMain />},
      { path: "/recommend/start", element: <RecommendStart />},
      { path: "/recommend/detail", element: <RecommendDetail />},
      { path: "/recommend/compare", element: <RecommendCompare />},
      { path: "/mission", element: <Mission />},
      { path: "/mission/analysis", element: <MissionAnalysis />},
      { path: "/mission/weekly", element: <MissionWeekly />},
      { path: "/mission/complete", element: <MissionComplete />},
      { path: "/passport", element: <Passport />},
      { path: "/plan-result", element: <PlanResult />},
      { path: "/mypage", element: <MyPage />},
      { path: "/mypage/info", element: <MyInfo />},
      { path: "/status/success", element: <StatusSuccess />},
      { path: "/status/error", element: <StatusError/>},
      { path: "/status/empty", element: <StatusEmpty />},
    ],
  },
  {
    path: "*", element: <NotFound />,
  }
];

export default routes;
