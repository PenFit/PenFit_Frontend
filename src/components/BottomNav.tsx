import { useNavigate, useLocation } from 'react-router-dom';

interface NavTab {
  key: string;
  label: string;
  icon: string;
  path: string;
}

const tabs: NavTab[] = [
  { key: 'recommend', label: '연금 추천', icon: 'ri-gift-line', path: '/recommend' },
  { key: 'mission', label: '행동 미션', icon: 'ri-flag-line', path: '/mission' },
  { key: 'home', label: '홈', icon: 'ri-home-5-line', path: '/home' },
  { key: 'passport', label: '패스포트', icon: 'ri-passport-line', path: '/passport' },
  { key: 'mypage', label: '마이페이지', icon: 'ri-user-3-line', path: '/mypage' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background-50 border-t border-background-100 z-20">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.key === 'home' && location.pathname === '/') ||
            (tab.key === 'recommend' && location.pathname.startsWith('/recommend')) ||
            (tab.key === 'passport' && location.pathname.startsWith('/passport')) ||
            (tab.key === 'mission' && location.pathname.startsWith('/mission'));
          const isHome = tab.key === 'home';

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 min-w-14 cursor-pointer"
            >
              <div className={`
                flex items-center justify-center transition-all duration-200
                ${isHome && isActive
                  ? 'w-10 h-10 -mt-4 bg-primary-500 rounded-full shadow-sm'
                  : 'w-6 h-6'
                }
              `}>
                <i className={`
                  ${tab.icon} flex items-center justify-center
                  ${isHome && isActive ? 'text-background-50 text-lg' : 'text-lg'}
                  ${!isHome && isActive ? 'text-primary-500' : ''}
                  ${!isActive ? 'text-foreground-400' : ''}
                `} />
              </div>
              <span className={`
                text-[10px] font-medium transition-colors duration-200 whitespace-nowrap
                ${isActive ? 'text-primary-500' : 'text-foreground-400'}
              `}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}