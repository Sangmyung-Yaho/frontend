import appLogo from '../assets/logo/app-logo.svg';
import googleIcon from '../assets/icons/google.svg';
import kakaoIcon from '../assets/icons/kakao.svg';
import { startOAuthLogin } from '../api/auth';
import { LogoCard } from '../components/common';

function LandingPage() {
  return (
    <main
      className="relative -mx-4 flex min-h-dvh w-[calc(100%+32px)] flex-col overflow-hidden px-4 pb-[max(95px,env(safe-area-inset-bottom))] pt-[clamp(112px,24vh,205px)]"
      style={{
        background:
          'linear-gradient(180deg, #FFF 0%, #C0DEA9 19.71%, #A5D084 52.88%, #5DAB22 100%)',
      }}
    >
      <section className="px-2 text-white">
        <LogoCard src={appLogo} alt="바로케어" className="mb-7" />

        <h1 className="text-[32px] font-bold leading-[1.18] tracking-[-0.02em]">
          오늘 내 피부 원인,
          <br />
          바로케어가 알려드려요
        </h1>
        <p className="mt-4 text-[14px] font-medium leading-[1.35]">
          수면·스트레스·물 섭취까지 합쳐서 원인을 찾고,
          <br />
          오늘 할 일로 연결해요.
        </p>
      </section>

      <section aria-label="소셜 로그인" className="mt-auto space-y-2">
        <button
          type="button"
          onClick={() => startOAuthLogin('kakao')}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-status-yellow px-4 text-headline text-[#321b1b] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img src={kakaoIcon} alt="" className="h-6 w-6" />
          <span>카카오로 계속하기</span>
        </button>

        <button
          type="button"
          onClick={() => startOAuthLogin('google')}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-headline text-text-primary transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
        >
          <img src={googleIcon} alt="" className="h-7 w-7 shrink-0" />
          <span>Google로 계속하기</span>
        </button>
      </section>
    </main>
  );
}

export default LandingPage;
