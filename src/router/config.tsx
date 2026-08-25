import type { RouteObject } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Login from "../pages/login/Login";
import Splash from "../pages/splash/Splash";
import Step1 from "../pages/basic_info/Step1";
import Step2 from "../pages/basic_info/Step2";
import Step3 from "../pages/basic_info/Step3";

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
    ],
  },
];

export default routes;
