import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';
import guideAccessoriesIcon from '../assets/onboarding/guide-accessories.svg';
import guideFaceIcon from '../assets/onboarding/guide-face.svg';
import guideLightIcon from '../assets/onboarding/guide-light.svg';
import completeIllustration from '../assets/onboarding/onboarding-complete.png';
import photoGuideImage from '../assets/onboarding/photo-guide.png';
import skinCombinationIcon from '../assets/onboarding/skin-combination.svg';
import skinDryIcon from '../assets/onboarding/skin-dry.svg';
import skinOilyIcon from '../assets/onboarding/skin-oily.svg';
import skinSensitiveIcon from '../assets/onboarding/skin-sensitive.svg';
import { Button, Checkbox, Input, Radio } from '../components/common';
import OnboardingProgress from '../components/onboarding/OnboardingProgress';
import { THEME_COLORS, useThemeColor } from '../hooks/useThemeColor';
import { BackHeader } from '../layouts';
import { preloadFaceLandmarker } from './camera/faceLandmarker';

const TOTAL_STEPS = 6;
const HEIGHT_RANGE = { min: 100, max: 250 };

const BODY_TYPE_WATER_RULES = [
  { maxBmi: 18.5, millilitersPerKilogram: 35 },
  { maxBmi: 25, millilitersPerKilogram: 30 },
  { maxBmi: 30, millilitersPerKilogram: 28 },
  { maxBmi: Number.POSITIVE_INFINITY, millilitersPerKilogram: 25 },
];

type AgreementKey = 'terms' | 'privacy' | 'age' | 'marketing';
type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive';

const requiredAgreements: AgreementKey[] = ['terms', 'privacy', 'age'];
const skinOptions = [
  { id: 'oily', title: '지성', description: '유분이 자주 올라와요.', icon: skinOilyIcon },
  { id: 'dry', title: '건성', description: '당기고 각질이 있어요.', icon: skinDryIcon },
  {
    id: 'combination',
    title: '복합성',
    description: 'T존만 유분이 있어요.',
    icon: skinCombinationIcon,
  },
  {
    id: 'sensitive',
    title: '민감성',
    description: '쉽게 붉어지고 따가워요.',
    icon: skinSensitiveIcon,
  },
] satisfies Array<{ id: SkinType; title: string; description: string; icon: string }>;

const failureReasons = [
  '무엇부터 해야 할지 몰라서',
  '귀찮아서',
  '해도 효과가 없어서',
  '실행할 여건이 안 돼서',
];

const photoGuides = [
  { title: '밝은 곳에서 찍어주세요.', description: '역광은 피해주세요.', icon: guideLightIcon },
  {
    title: '정면을 봐주세요.',
    description: '고개를 기울이면 분석이 어려워요.',
    icon: guideFaceIcon,
  },
  {
    title: '안경 · 마스크는 벗어주세요.',
    description: '가려진 부분이 있으면 분석이 어려워요.',
    icon: guideAccessoriesIcon,
  },
];

function calculateMockWaterGoal(heightInCentimeters: number, weightInKilograms: number) {
  const heightInMeters = heightInCentimeters / 100;
  const bmi = weightInKilograms / heightInMeters ** 2;
  const rule = BODY_TYPE_WATER_RULES.find(({ maxBmi }) => bmi < maxBmi);
  const liters = (weightInKilograms * (rule?.millilitersPerKilogram ?? 30)) / 1000;

  return (Math.round(liters * 10) / 10).toFixed(1);
}

function AgreementLabel({
  required,
  children,
  hasDetails = true,
}: {
  required: boolean;
  children: string;
  hasDetails?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between">
      <span className="flex items-center gap-1">
        <span className={`text-caption ${required ? 'text-danger' : 'text-text-secondary'}`}>
          ({required ? '필수' : '선택'})
        </span>
        <span className="text-body text-text-primary">{children}</span>
      </span>
      {hasDetails && (
        <img src={arrowLeftIcon} alt="" className="h-3 w-1.5 rotate-180" aria-hidden="true" />
      )}
    </span>
  );
}

function OnboardingPage() {
  useThemeColor(THEME_COLORS.onboarding);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStep = Number(searchParams.get('step'));
  const [step, setStep] = useState(
    Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= TOTAL_STEPS
      ? requestedStep
      : 1,
  );
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    void preloadFaceLandmarker().catch(() => undefined);
  }, []);

  const allAgreed = Object.values(agreements).every(Boolean);
  const requiredAgreed = requiredAgreements.every((key) => agreements[key]);
  const numericHeight = Number(height);
  const numericWeight = Number(weight);
  const isHeightValid =
    height !== '' &&
    Number.isFinite(numericHeight) &&
    numericHeight >= HEIGHT_RANGE.min &&
    numericHeight <= HEIGHT_RANGE.max;
  const isWeightValid = weight !== '' && Number.isFinite(numericWeight) && numericWeight > 0;
  const heightError =
    height !== '' && !isHeightValid ? '100~250cm 사이로 입력해주세요.' : undefined;
  const waterGoal =
    isHeightValid && isWeightValid
      ? calculateMockWaterGoal(numericHeight, numericWeight)
      : undefined;

  const canContinue = useMemo(() => {
    if (step === 1) return requiredAgreed;
    if (step === 2) return isHeightValid && isWeightValid;
    if (step === 3) return Boolean(skinType);
    if (step === 4) return photoConsent;
    if (step === 5)
      return Boolean(failureReason && (failureReason !== 'other' || customReason.trim()));
    return true;
  }, [
    customReason,
    failureReason,
    isHeightValid,
    isWeightValid,
    photoConsent,
    requiredAgreed,
    skinType,
    step,
  ]);

  const titles = [
    '',
    '약관 동의',
    '신체 정보 입력',
    '피부 타입 선택',
    '피부 사진 촬영',
    '실패 요인 확인',
    '바로케어 시작하기',
  ];
  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    setSearchParams({ step: String(nextStep) }, { replace: true });
  };
  const handleBack = () => step > 1 && goToStep(step - 1);
  const handleNext = () => {
    if (step === 4) {
      navigate('/camera');
      return;
    }
    if (step < TOTAL_STEPS) goToStep(step + 1);
  };
  const handleSkip = () => step < TOTAL_STEPS && goToStep(step + 1);
  const toggleAgreement = (key: AgreementKey) =>
    setAgreements((current) => ({ ...current, [key]: !current[key] }));
  const toggleAllAgreements = () => {
    const value = !allAgreed;
    setAgreements({ terms: value, privacy: value, age: value, marketing: value });
  };

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <div className="h-[env(safe-area-inset-top)] shrink-0" aria-hidden="true" />
      <div className="relative">
        <BackHeader title={titles[step]} onBack={handleBack} />
        {(step === 3 || step === 4) && (
          <button
            type="button"
            onClick={handleSkip}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-body-small text-text-secondary [text-decoration-skip-ink:none] [text-underline-position:from-font] hover:underline focus-visible:underline active:underline"
          >
            건너뛰기
          </button>
        )}
      </div>
      <OnboardingProgress currentStep={step} />

      <div
        className={
          step === 6 ? 'flex-1' : `flex-1 pb-[107px] ${step === 4 || step === 5 ? 'pt-4' : 'pt-2'}`
        }
      >
        {step === 1 && (
          <section>
            <h2 className="mb-6 max-w-[245px] text-title-1 leading-[1.2]">
              서비스 이용을 위해 동의가 필요해요.
            </h2>
            <Checkbox
              checked={allAgreed}
              onChange={toggleAllAgreements}
              className={`mb-6 h-[76px] w-full gap-[10px] rounded-[10px] px-5 py-4 ring-1 ring-inset transition-colors [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 ${
                allAgreed ? 'bg-main-50 ring-main-500' : 'bg-card ring-gray-100'
              }`}
              label={
                <span className="flex flex-col gap-2">
                  <strong className="text-caption-3 text-text-primary">전체 동의하기</strong>
                  <span className="text-body-small text-text-secondary">
                    필수 3개, 선택 1개 항목에 모두 동의합니다.
                  </span>
                </span>
              }
            />
            <div className="flex flex-col gap-4">
              <Checkbox
                checked={agreements.terms}
                onChange={() => toggleAgreement('terms')}
                className="w-full gap-4 [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                label={<AgreementLabel required>이용약관</AgreementLabel>}
              />
              <Checkbox
                checked={agreements.privacy}
                onChange={() => toggleAgreement('privacy')}
                className="w-full gap-4 [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                label={<AgreementLabel required>개인정보 수집 · 이용</AgreementLabel>}
              />
              <Checkbox
                checked={agreements.age}
                onChange={() => toggleAgreement('age')}
                className="w-full gap-4 [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                label={
                  <AgreementLabel required hasDetails={false}>
                    만 14세 이상
                  </AgreementLabel>
                }
              />
              <div className="border-t border-gray-100 pt-4">
                <Checkbox
                  checked={agreements.marketing}
                  onChange={() => toggleAgreement('marketing')}
                  className="w-full gap-4 [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                  label={<AgreementLabel required={false}>마케팅 정보 수신</AgreementLabel>}
                />
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-title-1">키와 몸무게를 알려주세요.</h2>
              <p className="text-body-small text-text-secondary">
                하루 목표 음수량을 계산하는 데 쓰여요.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-caption-3 text-text-primary">
                키
                <Input
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                  inputMode="decimal"
                  suffix="cm"
                  errorMessage={heightError}
                  isValid={isHeightValid}
                  aria-label="키"
                />
              </label>
              <label className="flex flex-col gap-1 text-caption-3 text-text-primary">
                몸무게
                <Input
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  inputMode="decimal"
                  suffix="kg"
                  isValid={isWeightValid}
                  aria-label="몸무게"
                />
              </label>
            </div>
            {waterGoal && (
              <div className="mt-[18px]">
                <div className="flex h-[101px] flex-col justify-center rounded-[10px] bg-main-50 px-5 py-6 ring-1 ring-inset ring-main-500">
                  <span className="mb-2 text-caption-3 text-main-700">오늘의 목표 음수량</span>
                  <strong className="text-title-1 text-main-700">{waterGoal}L</strong>
                </div>
                <p className="mt-2 text-[11px] leading-[normal] text-text-secondary">
                  체중과 체형 구간을 기준으로 계산해요. 프로필에서 언제든 수정할 수 있어요.
                </p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-title-1">피부 타입을 선택해주세요.</h2>
              <p className="text-body-small text-text-secondary">
                지표를 판정하는 기준선을 타입에 맞게 보정해요.
              </p>
            </div>
            <div className="relative left-1/2 grid w-[362px] max-w-[calc(100vw-31px)] -translate-x-1/2 grid-cols-2 gap-x-4 gap-y-2">
              {skinOptions.map((option) => {
                const selected = skinType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSkinType(option.id)}
                    className={`flex h-[90px] w-full min-w-0 flex-col items-start justify-center rounded-[10px] bg-card px-5 py-6 text-left ring-1 ring-inset transition-colors ${
                      selected ? 'bg-main-50 ring-main-500' : 'ring-gray-100'
                    }`}
                  >
                    <span className="mb-2 flex items-center gap-2">
                      <img src={option.icon} alt="" className="h-[18px] w-[18px] object-contain" />
                      <strong className="text-caption-3">{option.title}</strong>
                    </span>
                    <span className="whitespace-nowrap text-caption text-text-secondary">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <div className="mb-4 flex flex-col gap-2">
              <h2 className="text-title-1">아래 가이드에 맞춰 촬영해주세요.</h2>
              <p className="text-body-small text-text-secondary">
                이 결과는 참고용 정보이며 의료적 진단이 아니에요.
              </p>
            </div>
            <img
              src={photoGuideImage}
              alt="얼굴 정면 촬영 가이드"
              className="mx-auto mb-4 h-[166.015px] w-[172.447px] object-contain"
            />
            <div className="mb-4 flex flex-col gap-2">
              {photoGuides.map((guide) => (
                <div
                  key={guide.title}
                  className="flex h-[69px] items-center gap-4 rounded-[10px] bg-card px-5 py-4 ring-1 ring-inset ring-gray-100"
                >
                  <img src={guide.icon} alt="" className="h-8 w-8 object-contain" />
                  <span className="flex flex-col gap-1">
                    <strong className="text-caption-3">{guide.title}</strong>
                    <span className="text-caption text-text-secondary">{guide.description}</span>
                  </span>
                </div>
              ))}
            </div>
            <Radio
              name="photo-consent"
              checked={photoConsent}
              onChange={() => setPhotoConsent(true)}
              className="gap-4 [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5"
              label="사진 촬영·분석에 동의합니다."
            />
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="mb-6 max-w-[246px] text-title-1 leading-[1.2]">
              전에 관리를 그만뒀다면,
              <br />
              이유가 뭐였나요?
            </h2>
            <div className="flex w-full max-w-[361px] flex-col gap-2">
              {failureReasons.map((reason) => (
                <Radio
                  key={reason}
                  name="failure-reason"
                  checked={failureReason === reason}
                  onChange={() => setFailureReason(reason)}
                  className={`h-[54px] w-full gap-[10px] rounded-[10px] px-5 py-4 ring-1 ring-inset transition-colors [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 ${
                    failureReason === reason ? 'bg-main-50 ring-main-500' : 'bg-card ring-gray-100'
                  }`}
                  label={reason}
                />
              ))}
              <div
                className={`flex h-[54px] items-center rounded-[10px] px-5 py-4 ring-1 ring-inset transition-colors ${
                  failureReason === 'other' ? 'bg-main-50 ring-main-500' : 'bg-card ring-gray-100'
                }`}
              >
                <Radio
                  name="failure-reason"
                  checked={failureReason === 'other'}
                  onChange={() => setFailureReason('other')}
                  className="w-full gap-[10px] [&>span:first-of-type]:h-5 [&>span:first-of-type]:w-5 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                  label={
                    failureReason === 'other' ? (
                      <input
                        autoFocus
                        value={customReason}
                        onChange={(event) => setCustomReason(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        placeholder="기타 내용을 작성해주세요."
                        className="w-full bg-transparent text-body outline-none placeholder:text-text-primary/50"
                        aria-label="기타 실패 요인"
                      />
                    ) : (
                      <span className="text-text-primary/50">기타 내용을 작성해주세요.</span>
                    )
                  }
                />
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="absolute inset-x-4 top-[calc(50%+0.5px)] flex -translate-y-1/2 flex-col items-center gap-14">
            <img
              src={completeIllustration}
              alt="돋보기로 피부를 살펴보는 바로케어 캐릭터"
              className="h-[246px] w-[145.92px] object-contain"
            />
            <div className="w-full">
              <h2 className="mb-4 text-display">
                귀찮았던 건
                <br />
                의지 문제가 아니에요.
              </h2>
              <p className="text-body text-black/[0.58]">
                할 일이 많으면 뇌는 가장 나중 순위를 자동으로 버려요.
                <br />
                그래서 매일 딱 3~4개, 지금 바로 할 수 있는 것만 남겨뒀어요.
              </p>
            </div>
          </section>
        )}
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full border-0 bg-background px-4 pb-[max(29px,env(safe-area-inset-bottom))] pt-2 outline-none ring-0 shadow-none focus-within:outline-none">
        <Button
          disabled={!canContinue}
          onClick={handleNext}
          aria-label={step === 6 ? '바로케어 시작하기' : undefined}
        >
          {step === 4 ? '촬영 시작하기' : step === 6 ? '시작하기' : '다음'}
        </Button>
      </div>
    </main>
  );
}

export default OnboardingPage;
