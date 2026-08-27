import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import { userProfileSections } from '../../../mocks/userProfile';

export default function MyInfo() {
  const navigate = useNavigate();

  return (
    <>
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            className="w-9 h-9 rounded-full bg-background-100 flex items-center justify-center shrink-0 cursor-pointer hover:bg-background-200 transition-colors"
          >
            <i className="ri-arrow-left-s-line text-foreground-600 text-xl w-6 h-6 flex items-center justify-center" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              내 정보 보기
            </h1>
            <p className="text-sm text-foreground-500">
              STEP 1~3에서 입력한 정보예요
            </p>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-6">
          {userProfileSections.map((section) => (
            <div key={section.id} className="bg-background-100 rounded-2xl p-5">
              {/* 각 섹션 헤더 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <i className={`${section.icon} text-primary-600 text-lg w-5 h-5 flex items-center justify-center`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-foreground-950">
                    {section.title}
                  </h2>
                  <p className="text-xs text-primary-500 font-semibold">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* 내용 필드 */}
              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-3 bg-background-50 rounded-xl px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center shrink-0">
                      <i className={`${field.icon} text-foreground-500 text-base w-4 h-4 flex items-center justify-center`} />
                    </div>
                    <span className="text-sm text-foreground-600 flex-1">
                      {field.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground-950 text-right">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 안내 */}
          <div className="flex items-start gap-3 bg-accent-50 rounded-2xl p-4">
            <i className="ri-information-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center mt-0.5 shrink-0" />
            <p className="text-xs text-accent-800 leading-relaxed">
              내 정보는 가상 체험에만 사용되며, 실제 금융상품 가입과 무관해요. 정보를 수정하려면 시뮬레이션을 다시 진행해주세요.
            </p>
          </div>
        </div>

        <BottomNav />
    </>
  );
}
