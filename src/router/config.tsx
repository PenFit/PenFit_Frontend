import type { RouteObject } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Login from "../pages/login/Login";
import Splash from "../pages/splash/Splash";

// 앱에서 사용할 URL 경로와 각 경로에 보여줄 페이지 컴포넌트를 정의
const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Splash /> },
      { path: "/login", element: <Login /> },
    ],
  },
];

export default routes;
