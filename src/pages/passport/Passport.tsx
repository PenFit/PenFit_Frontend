import { useState } from 'react';
import BottomNav from '../../components/BottomNav';

export default function Passport() {
  const [activeTab, setActiveTab] = useState<'personality' | 'detail'>('personality');

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
          {/* 헤더 */}
          <div className="px-6 pt-6 pb-2">
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              연금 패스포트
            </h1>
            <p className="text-sm text-foreground-500">
              성실한 개척자형
            </p>
          </div>

          {/* 아이콘 */}
          <div className="px-6 pb-4 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center">
              <i className="ri-passport-line text-background-50 text-2xl w-8 h-8 flex items-center justify-center" />
            </div>
          </div>

          {/* 탭 */}
          <div className="px-6 pb-4 flex border-b border-background-200">
            <button
              type="button"
              onClick={() => setActiveTab('personality')}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'personality'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-foreground-400'
              }`}
            >
              성향
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('detail')}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'detail'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-foreground-400'
              }`}
            >
              세부 분석
            </button>
          </div>

          {/* 각 탭마다의 내용 */}
          {activeTab === 'personality' && (
            <div className="animate-fade-in">
              <div className="px-6 pb-4 grid grid-cols-1 gap-3">
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">월 납입액 유지 가능액</p>
                  <p className="text-lg font-bold text-foreground-950">12만원</p>
                </div>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">가장 큰 흐름 위험</p>
                  <p className="text-base font-bold text-accent-600">주택 구매</p>
                </div>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">시장 위험도</p>
                  <p className="text-base font-bold text-primary-600">중간</p>
                </div>
              </div>

              {/* AI 분석 요약 */}
              <div className="px-6 pb-6">
                <h3 className="text-base font-bold text-foreground-950 mb-3">
                  AI 분석 요약
                </h3>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-sm text-foreground-700 leading-relaxed mb-3">
                    6가지 상황 이벤트에서 꾸준히 납입을 유지하는 경향. 시장 하락 시 오히려 납입을 늘리는 모습이 인상적이야
                  </p>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                    onClick={() => setActiveTab('detail')}
                  >
                    AI가 이렇게 판단한 이유
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detail' && (
            <div className="px-6 pb-6 animate-fade-in">
              <p className="text-sm text-foreground-500 text-center py-10">
                세부 분석 데이터를 준비 중이에요
              </p>
            </div>
          )}
        </div>

        <BottomNav />
    </>
  );
}