import type { RouteObject } from "react-router-dom";
import Splash from "../pages/splash/Splash";

const routes: RouteObject[] = [
  {
    children: [
      { path: "/", element: <Splash />},
    ]
  }
]

export default routes;