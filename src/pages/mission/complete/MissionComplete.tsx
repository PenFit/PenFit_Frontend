import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';

export default function MissionComplete() {
  const navigate = useNavigate();

  return (
    <>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6 animate-fade-in">
            <i className="ri-check-line text-primary-500 text-4xl w-10 h-10 flex items-center justify-center" />
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-bold text-foreground-950 font-heading mb-2 animate-fade-in">
            미션 완료!
          </h1>
          <p className="text-sm text-foreground-600 mb-10 animate-fade-in">
            커피값 아껴서 연금 넣기 성공
          </p>

          {/* 금액 */}
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-xs text-foreground-500 mb-1">
              확보된 금액
            </p>
            <p className="text-4xl font-bold text-primary-500">
              3만원
            </p>
          </div>

          {/* 부가 설명 */}
          <div className="w-full bg-primary-50 rounded-xl p-5 mb-10 animate-fade-in">
            <p className="text-sm font-semibold text-primary-800 text-center mb-2">
              연금계획에 미치는 영향
            </p>
            <p className="text-sm text-foreground-700 text-center leading-relaxed">
              월 3만원을 30년간 추가 납입하면
            </p>
            <div className="mt-3 text-center">
              <span className="text-lg font-bold text-primary-600">
                예상 연금자산이 약 1,980만원 늘어나요
              </span>
            </div>
          </div>

          {/* 홈 버튼 */}
          <button
            type="button"
            onClick={() => navigate('/mission')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer animate-fade-in"
          >
            미션 홈으로 가기
          </button>
        </div>

        <BottomNav />
    </>
  );
}