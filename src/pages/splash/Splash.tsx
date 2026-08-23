import { useNavigate } from "react-router-dom";
import icon from "../../assets/icon.png";
import Button from "../../components/Button";

export default function Splash() {
  // 시작 버튼을 눌렀을 때 로그인 페이지로 이동하기 위한 라우터 함수
  const navigate = useNavigate();

  return (
    <main className="flex h-full min-h-0 flex-col bg-background-50">
      {/* 앱 로고, 서비스명, 소개 문구를 중앙에 배치하는 메인 콘텐츠 영역 */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-20">
        <img
          src={icon}
          alt="PenFit"
          className="mb-9 h-20 w-20 animate-fade-in rounded-2xl"
        />

        <h1 className="mb-4 font-heading text-2xl font-bold text-foreground-950">
          PenFit
        </h1>

        <p className="text-center text-sm leading-relaxed text-foreground-700">
          실제 돈을 넣기 전에, 내 연금생활을 미리 연습해보세요
        </p>
      </section>

      {/* 로그인 페이지로 진입하는 하단 시작 버튼 영역 */}
      <div className="px-6 pb-10">
        <Button onClick={() => navigate("/login")}>시작하기</Button>
      </div>
    </main>
  );
}
