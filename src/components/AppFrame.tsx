import type { ReactNode } from 'react';

interface AppFrameProps {
  children: ReactNode;
}

export default function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="min-h-dvh bg-background-100">
      {/* 데스크탑, 태블릿 */}
      <div className="hidden min-h-dvh items-center justify-center px-6 md:flex lg:px-12">

        {/* 중앙 앱 사이즈 */}
        <div className="relative flex h-[min(calc(100dvh-3rem),812px)] w-[375px] flex-col overflow-hidden rounded-3xl border border-background-200 bg-background-50 shadow-xl">
          {children}
        </div>

      </div>

      {/* 모바일 */}
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background-50 md:hidden">
        {children}
      </div>
    </div>
  );
}
