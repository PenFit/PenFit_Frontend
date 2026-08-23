import type { ButtonHTMLAttributes, ReactNode } from "react";

// 기본 button 속성을 그대로 받으면서 버튼 안에 들어갈 내용을 children으로 전달받음
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({ children, className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      // 앱에서 반복해서 쓰는 기본 버튼 스타일에 필요한 경우 추가 className을 덧붙임
      className={`w-full rounded-lg bg-primary-500 px-4 py-4 font-semibold text-background-50 transition-colors hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
