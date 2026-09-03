import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueAccessToken } from "../apis/client";
import { clearAuthSession } from "../apis/auth";
import { getAccessToken } from "../utils/authToken";

type AuthCheckStatus = "checking" | "authenticated" | "unauthenticated";

export default function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState<AuthCheckStatus>(() =>
    getAccessToken() ? "authenticated" : "checking",
  );

  useEffect(() => {
    if (getAccessToken()) {
      return;
    }

    let mounted = true;

    reissueAccessToken()
      .then(() => {
        if (mounted) {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        clearAuthSession();

        if (mounted) {
          setStatus("unauthenticated");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="flex h-full min-h-0 flex-col items-center justify-center bg-background-50 px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
          <i className="ri-loader-4-line flex h-7 w-7 animate-spin items-center justify-center text-2xl text-primary-600" />
        </div>
        <p className="text-sm leading-relaxed text-foreground-600">
          로그인 상태를 확인하고 있어요.
        </p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
