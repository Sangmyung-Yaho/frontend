import appLogo from '../assets/logo/app-logo.svg';
import kakaoIcon from '../assets/icons/kakao.svg';

function LandingPage() {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-hidden px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-[clamp(112px,24vh,205px)]"
      style={{
        background:
          'linear-gradient(180deg, #FFF 0%, #C0DEA9 19.71%, #A5D084 52.88%, #5DAB22 100%)',
      }}
    >
      <section className="px-2 text-white">
        <div
          role="img"
          aria-label="바로케어"
          className="mb-7 h-[132px] w-[132px] shrink-0 overflow-hidden rounded-[30px] shadow-[0_3px_5px_0_rgba(0,0,0,0.25)] aspect-square"
          style={{
            background: `url("${appLogo}") lightgray 50% / cover no-repeat`,
          }}
        />

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
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-status-yellow px-4 text-headline text-[#321b1b] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img src={kakaoIcon} alt="" className="h-6 w-6" />
          <span>카카오로 계속하기</span>
        </button>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-headline text-text-primary transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
        >
          <span
            aria-hidden="true"
            className="bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_0_42%,#fbbc05_0_66%,#ea4335_0_83%,#4285f4_0)] bg-clip-text text-[27px] font-bold leading-none text-transparent"
          >
            G
          </span>
          <span>Google로 계속하기</span>
        </button>
      </section>
    </main>
  );
}

export default LandingPage;
