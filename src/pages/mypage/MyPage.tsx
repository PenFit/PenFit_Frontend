import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, logout } from '../../apis/auth';
import { deleteEmail, getMyInformation, updateEmailConsent, updateMyEmail, updateMyNickname, type UserMe } from '../../apis/user';
import BottomNav from '../../components/BottomNav';

interface MenuItem {
  icon: string;
  title: string;
  action: () => void;
  variant?: 'default' | 'danger';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getLoginProviderLabel(loginProvider?: string) {
  const normalizedProvider = loginProvider?.toLowerCase() ?? '';

  if (normalizedProvider.includes('demo')) {
    return '심사용 데모 로그인';
  }

  if (normalizedProvider === 'kakao') {
    return '카카오 로그인';
  }

  return loginProvider ?? '로그인 정보';
}

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserMe | null>(null);
  const [nickname, setNickname] = useState('사용자님');
  const [nicknameInput, setNicknameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showDeleteEmailConfirm, setShowDeleteEmailConfirm] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isDeletingEmail, setIsDeletingEmail] = useState(false);
  const [isUpdatingEmailConsent, setIsUpdatingEmailConsent] = useState(false);
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  useEffect(() => {
    const fetchMyInformation = async () => {
      try {
        const myInformation = await getMyInformation();
        setUserInfo(myInformation);
        setNickname(myInformation.nickname);
      } catch (error) {
        console.error('내 회원정보 조회에 실패했어요.', error);
      }
    };

    fetchMyInformation();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 API 호출에 실패했어요.', error);
    } finally {
      clearAuthSession();
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  const openEmailModal = () => {
    setEmailInput(userInfo?.email ?? '');
    setIsEditingEmail(false);
    setShowEmail(true);
  };

  const handleUpdateEmail = async () => {
    const nextEmail = emailInput.trim();

    if (!nextEmail || isUpdatingEmail) {
      return;
    }

    if (!isValidEmail(nextEmail)) {
      setEmailErrorMessage('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsUpdatingEmail(true);

    try {
      const updatedUser = await updateMyEmail(nextEmail);
      setUserInfo(updatedUser);
      setEmailInput(updatedUser.email ?? '');
      setEmailErrorMessage('');
      setIsEditingEmail(false);
    } catch (error) {
      console.error('이메일 수정에 실패했어요.', error);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleDeleteEmail = async () => {
    if (isDeletingEmail) {
      return;
    }

    setIsDeletingEmail(true);

    try {
      await deleteEmail();
      setUserInfo((prev) => (prev ? { ...prev, email: '' } : prev));
      setEmailInput('');
      setEmailErrorMessage('');
      setShowDeleteEmailConfirm(false);
      setShowEmail(false);
    } catch (error) {
      console.error('이메일 삭제에 실패했어요.', error);
    } finally {
      setIsDeletingEmail(false);
    }
  };

  const handleUnsubscribeEmail = async () => {
    if (isUpdatingEmailConsent) {
      return;
    }

    setIsUpdatingEmailConsent(true);

    try {
      const updatedUser = await updateEmailConsent(false);
      setUserInfo(updatedUser);
      setUnsubscribed(true);
      setShowUnsubscribe(false);
      window.setTimeout(() => setUnsubscribed(false), 2500);
    } catch (error) {
      console.error('이메일 수신 거부에 실패했어요.', error);
    } finally {
      setIsUpdatingEmailConsent(false);
    }
  };

  const handleSubscribeEmail = async () => {
    if (isUpdatingEmailConsent) {
      return;
    }

    if (!userInfo?.email) {
      openEmailModal();
      setIsEditingEmail(true);
      return;
    }

    setIsUpdatingEmailConsent(true);

    try {
      const updatedUser = await updateEmailConsent(true);
      setUserInfo(updatedUser);
      setSubscribed(true);
      window.setTimeout(() => setSubscribed(false), 2500);
    } catch (error) {
      console.error('이메일 수신 동의에 실패했어요.', error);
    } finally {
      setIsUpdatingEmailConsent(false);
    }
  };

  const handleUpdateNickname = async () => {
    const nextNickname = nicknameInput.trim();

    if (!nextNickname || isUpdatingNickname) {
      return;
    }

    setIsUpdatingNickname(true);

    try {
      const updatedUser = await updateMyNickname(nextNickname);
      setUserInfo(updatedUser);
      setNickname(updatedUser.nickname);
      setNicknameInput(updatedUser.nickname);
      setShowNickname(false);
    } catch (error) {
      console.error('닉네임 수정에 실패했어요.', error);
    } finally {
      setIsUpdatingNickname(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'ri-user-line',
      title: '내 정보 보기',
      action: () => navigate('/mypage/info'),
    },
    {
      icon: 'ri-mail-line',
      title: '내 이메일 보기',
      action: openEmailModal,
    },
    {
      icon: 'ri-edit-line',
      title: '닉네임 수정',
      action: () => {
        setNicknameInput(userInfo?.nickname ?? nickname);
        setShowNickname(true);
      },
    },
  ];

  const secondaryItems: MenuItem[] = [
    {
      icon: userInfo?.emailConsent ? 'ri-mail-close-line' : 'ri-mail-check-line',
      title: userInfo?.emailConsent ? '이메일 수신 거부' : '이메일 수신 동의',
      action: userInfo?.emailConsent ? () => setShowUnsubscribe(true) : handleSubscribeEmail,
      variant: 'default',
    },
    {
      icon: 'ri-logout-box-r-line',
      title: '로그아웃',
      action: () => setShowLogoutConfirm(true),
      variant: 'danger',
    },
  ];

  const profileInitial = nickname.trim().charAt(0) || '사';
  const loginProviderLabel = getLoginProviderLabel(userInfo?.loginProvider);
  const userEmail = userInfo?.email ?? '이메일 정보를 불러오는 중이에요';
  const hasEmail = Boolean(userInfo?.email);
  const emailConsentLabel = userInfo?.emailConsent ? '수신 동의' : '수신 미동의';
  const trimmedEmailInput = emailInput.trim();
  const emailFormatErrorMessage =
    isEditingEmail && trimmedEmailInput && !isValidEmail(trimmedEmailInput)
      ? '올바른 이메일 주소를 입력해주세요.'
      : '';
  const visibleEmailErrorMessage = emailErrorMessage || emailFormatErrorMessage;
  const canSaveEmail =
    isEditingEmail && isValidEmail(trimmedEmailInput) && !isUpdatingEmail;

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-700">
                {profileInitial}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground-950 font-heading">
                {nickname}님
              </h1>
              <p className="text-sm text-foreground-500">
                {loginProviderLabel}
              </p>
            </div>
          </div>

          {/* 메인 메뉴 */}
          <div className="space-y-3 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className="w-full flex items-center gap-4 bg-background-100 rounded-xl px-4 py-4 text-left hover:bg-background-200 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-primary-500 text-lg w-5 h-5 flex items-center justify-center`} />
                </div>
                <span className="text-sm font-semibold text-foreground-950 flex-1">
                  {item.title}
                </span>
                <i className="ri-arrow-right-s-line text-foreground-400 text-lg w-5 h-5 flex items-center justify-center" />
              </button>
            ))}
          </div>

          {/* 섹션 구분 */}
          <div className="border-t border-background-200 my-4" />

          {/* 서브 메뉴 */}
          <div className="space-y-3">
            {secondaryItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className={`
                  w-full flex items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors cursor-pointer
                  ${item.variant === 'danger'
                    ? 'bg-accent-50 hover:bg-accent-100'
                    : 'bg-background-100 hover:bg-background-200'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                  ${item.variant === 'danger'
                    ? 'bg-accent-100'
                    : 'bg-primary-50'
                  }
                `}>
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center
                    ${item.variant === 'danger'
                      ? 'text-accent-600'
                      : 'text-primary-500'
                    }
                  `} />
                </div>
                <span className={`
                  text-sm font-semibold flex-1
                  ${item.variant === 'danger'
                    ? 'text-accent-700'
                    : 'text-foreground-950'
                  }
                `}>
                  {item.title}
                </span>
                <i className="ri-arrow-right-s-line text-foreground-400 text-lg w-5 h-5 flex items-center justify-center" />
              </button>
            ))}
          </div>
        </div>

        <BottomNav />

        {/* 이메일 모달 */}
        {showEmail && (
          <div className="absolute inset-0 bg-black/40 z-30 flex items-end">
            <div className="w-full bg-background-50 rounded-t-2xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground-950">
                  내 이메일
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  className="w-8 h-8 rounded-full bg-background-100 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-foreground-500 text-lg w-5 h-5 flex items-center justify-center" />
                </button>
              </div>
              <div className="bg-background-100 rounded-xl p-4 mb-4">
                {isEditingEmail ? (
                  <div className="flex items-center gap-3">
                    <i className="ri-mail-line text-primary-500 text-lg w-5 h-5 flex items-center justify-center" />
	                    <input
	                      type="email"
	                      value={emailInput}
	                      onChange={(e) => {
	                        setEmailInput(e.target.value);
	                        setEmailErrorMessage('');
	                      }}
	                      className="min-w-0 flex-1 bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-400"
	                      placeholder="email@example.com"
	                    />
	                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <i className="ri-mail-line text-primary-500 text-lg w-5 h-5 flex items-center justify-center" />
                    <span className="text-sm text-foreground-950">
                      {hasEmail ? userEmail : '등록된 이메일이 없어요'}
                    </span>
                  </div>
                )}
	                <p className="mt-2 text-xs text-foreground-500">
	                  이메일 리포트 {emailConsentLabel}
	                </p>
                  {!isEditingEmail && hasEmail && !userInfo?.emailConsent && (
                    <button
                      type="button"
                      onClick={handleSubscribeEmail}
                      disabled={isUpdatingEmailConsent}
                      className="mt-3 w-full rounded-lg bg-primary-500 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdatingEmailConsent ? '처리 중' : '이메일 리포트 수신 동의하기'}
                    </button>
                  )}
	                {visibleEmailErrorMessage && (
	                  <p className="mt-2 text-xs text-accent-600">
	                    {visibleEmailErrorMessage}
	                  </p>
	                )}
	              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
	                    if (isEditingEmail) {
	                      setEmailInput(userInfo?.email ?? '');
	                      setEmailErrorMessage('');
	                      setIsEditingEmail(false);
	                      return;
	                    }

                    if (hasEmail) {
                      setShowDeleteEmailConfirm(true);
                      return;
                    }

                    setShowEmail(false);
                  }}
                  className={`w-full border border-background-300 bg-background-50 hover:bg-background-100 font-semibold py-3 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer ${
                    !isEditingEmail && hasEmail ? 'text-accent-700' : 'text-foreground-700'
                  }`}
                >
                  {isEditingEmail ? '취소' : hasEmail ? '삭제하기' : '완료하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingEmail) {
                      handleUpdateEmail();
                      return;
                    }

	                    setEmailInput(userInfo?.email ?? '');
	                    setEmailErrorMessage('');
	                    setIsEditingEmail(true);
	                  }}
	                  disabled={isEditingEmail && !canSaveEmail}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditingEmail ? (isUpdatingEmail ? '저장 중' : '저장하기') : hasEmail ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 이메일 삭제 확인 모달 */}
        {showDeleteEmailConfirm && (
          <div className="absolute inset-0 bg-black/40 z-40 flex items-center justify-center px-6">
            <div className="w-full bg-background-50 rounded-2xl p-6 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-close-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h3 className="text-lg font-bold text-foreground-950 text-center mb-2">
                이메일을 삭제할까요?
              </h3>
              <p className="text-sm text-foreground-600 text-center mb-6">
                등록된 이메일 주소가 마이페이지에서 삭제돼요
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteEmailConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-foreground-700 bg-background-100 hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleDeleteEmail}
                  disabled={isDeletingEmail}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-background-50 bg-accent-500 hover:bg-accent-600 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeletingEmail ? '삭제 중' : '삭제하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 닉네임 수정 모달 */}
        {showNickname && (
          <div className="absolute inset-0 bg-black/40 z-30 flex items-end">
            <div className="w-full bg-background-50 rounded-t-2xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground-950">
                  닉네임 수정
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNickname(false)}
                  className="w-8 h-8 rounded-full bg-background-100 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-foreground-500 text-lg w-5 h-5 flex items-center justify-center" />
                </button>
              </div>
              <label className="block text-sm font-semibold text-foreground-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={10}
                placeholder="닉네임을 입력하세요"
                className="w-full bg-background-100 rounded-xl px-4 py-3 text-sm text-foreground-950 outline-none focus:ring-2 focus:ring-primary-400 border border-transparent focus:border-primary-300 transition mb-4"
              />
              <button
                type="button"
                disabled={!nicknameInput.trim() || isUpdatingNickname}
                onClick={handleUpdateNickname}
                className={`
                  w-full font-semibold py-3 rounded-xl text-sm transition-colors whitespace-nowrap
                  ${nicknameInput.trim() && !isUpdatingNickname
                    ? 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
                    : 'bg-background-200 text-foreground-400 cursor-not-allowed'
                  }
                `}
              >
                {isUpdatingNickname ? '변경 중' : '변경하기'}
              </button>
            </div>
          </div>
        )}

        {/* 이메일 수신 모달 */}
        {showUnsubscribe && (
          <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center px-6">
            <div className="w-full bg-background-50 rounded-2xl p-6 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-close-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h3 className="text-lg font-bold text-foreground-950 text-center mb-2">
                이메일 수신을 거부할까요?
              </h3>
              <p className="text-sm text-foreground-600 text-center mb-6">
                주간 미션 분석 리포트 등 이메일을 더 이상 받지 않아요
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUnsubscribe(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-foreground-700 bg-background-100 hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribeEmail}
                  disabled={isUpdatingEmailConsent}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-background-50 bg-accent-500 hover:bg-accent-600 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingEmailConsent ? '처리 중' : '수신 거부'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 수신 거부 토스트 */}
        {unsubscribed && (
          <div className="absolute inset-x-6 bottom-24 z-40 animate-fade-in">
            <div className="bg-foreground-950 text-background-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <i className="ri-checkbox-circle-line text-secondary-400 text-lg w-5 h-5 flex items-center justify-center" />
              <span className="text-sm font-semibold">
                이메일 수신 거부가 완료됐어요
              </span>
            </div>
          </div>
        )}

        {/* 수신 동의 토스트 */}
        {subscribed && (
          <div className="absolute inset-x-6 bottom-24 z-40 animate-fade-in">
            <div className="bg-foreground-950 text-background-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <i className="ri-checkbox-circle-line text-secondary-400 text-lg w-5 h-5 flex items-center justify-center" />
              <span className="text-sm font-semibold">
                이메일 수신 동의가 완료됐어요
              </span>
            </div>
          </div>
        )}

        {/* 로그아웃 모달 */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center px-6">
            <div className="w-full bg-background-50 rounded-2xl p-6 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-logout-box-r-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h3 className="text-lg font-bold text-foreground-950 text-center mb-2">
                로그아웃 할까요?
              </h3>
              <p className="text-sm text-foreground-600 text-center mb-6">
                다시 로그인하면 모든 데이터가 복원돼요
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-foreground-700 bg-background-100 hover:bg-background-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-background-50 bg-accent-500 hover:bg-accent-600 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? '로그아웃 중' : '로그아웃'}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
