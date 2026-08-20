import { Navigate, useParams } from 'react-router-dom';
import { MyPageLayout } from '../components/mypage';

type PolicySlug = 'terms' | 'privacy' | 'marketing' | 'age';

interface PolicySection {
  heading: string;
  paragraphs: string[];
}

interface PolicyDetail {
  title: string;
  notice: string;
  sections: PolicySection[];
  footer?: string;
  cardClassName: string;
}

const POLICY_DETAILS: Record<PolicySlug, PolicyDetail> = {
  terms: {
    title: '이용 약관',
    cardClassName: 'h-[584px] w-[361px] px-[13px] py-3',
    notice:
      '본 서비스가 제공하는 피부 분석 리포트는 의료행위·진단이 아닌 참고용 웰니스 정보입니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        paragraphs: [
          '본 약관은 바로케어의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
        ],
      },
      {
        heading: '제2조 (정의)',
        paragraphs: [
          '· 서비스 — 생활습관 데이터와 얼굴(피부) 이미지를 AI로 통합 분석해 피부 리포트·루틴을 제공하는 서비스\n· 체크인 — 매일 입력하는 수면·스트레스·물 섭취·피부촬영 활동 데이터\n· 리포트 — 체크인과 촬영 이미지를 바탕으로 산출되는 분석 결과물',
        ],
      },
      {
        heading: '제5조 (의료서비스가 아님에 대한 고지)',
        paragraphs: [
          '1. 피부 분석 리포트·등급·루틴 미션 등 모든 콘텐츠는 참고용 웰니스 정보이며, 「의료법」상 의료행위·진단·처방·치료에 해당하지 않습니다.\n2. 서비스는 의료인의 진료·상담·처방을 대체하지 않습니다.\n3. 이상 증상이 있는 경우 반드시 의료기관을 방문해 전문의 진료를 받아야 합니다.',
        ],
      },
    ],
    footer:
      '제6~11조(회원가입, 의무, 유료서비스, 면책, 관할법원)는 전문 문서에서 전체 확인 가능합니다.',
  },
  privacy: {
    title: '개인정보 수집·이용',
    cardClassName: 'h-[457px] w-[363px] px-[14px] py-[13px]',
    notice:
      '얼굴(피부) 촬영 이미지는 신원확인·생체인증이 아닌 피부 지표 분석 목적으로만 사용됩니다.',
    sections: [
      {
        heading: '1. 수집 항목',
        paragraphs: [
          '· 필수 — 계정정보(이메일/비밀번호), 키·몸무게, 체크인 데이터(수면·스트레스·물 섭취), 얼굴(피부) 촬영 이미지, 서비스 이용기록·접속 로그·기기정보\n· 선택 — 피부타입, 온보딩 시 얼굴 사진',
        ],
      },
      {
        heading: '2. 얼굴(피부) 촬영 이미지 특별 고지',
        paragraphs: [
          '· 온보딩 촬영은 선택, 일일 체크인 촬영은 리포트 생성을 위한 필수 입력\n· 신원확인·생체인증 목적 사용 안 함 — 피부 지표 분석·시점 비교 전용\n· AI 분석 외부 위탁 시 수탁업체·업무 내용 사전 고지\n· 마이페이지에서 언제든지 열람·삭제 요청 가능',
        ],
      },
    ],
    footer: '보유기간은 3년이며, 촬영 이미지는 3년 경과 시 지체 없이 파기됩니다.',
  },
  marketing: {
    title: '마케팅 정보 수신',
    cardClassName: 'h-[287px] w-[363px] px-[14px] py-[13px]',
    notice: '선택 동의 항목이며, 동의하지 않아도 서비스 이용에는 제한이 없습니다.',
    sections: [
      {
        heading: '수집 및 이용 목적',
        paragraphs: [
          '· 신규 서비스·이벤트·프로모션 안내\n· 이용 패턴 기반 맞춤형 콘텐츠·알림 발송',
        ],
      },
      {
        heading: '수신 방법 · 철회',
        paragraphs: [
          '앱 푸시, 이메일, 문자메시지로 발송되며 마이페이지에서 언제든지 수신 거부할 수 있습니다.',
        ],
      },
    ],
  },
  age: {
    title: '만 14세 이상 확인',
    cardClassName: 'h-[305px] w-[361px] px-[13px] py-3',
    notice: '본 서비스는 만 14세 이상만 가입 및 이용할 수 있습니다.',
    sections: [
      {
        heading: '제2조 (이용 연령 제한)',
        paragraphs: [
          '1. 만 14세 미만 아동은 법정대리인 동의 여부와 관계없이 가입할 수 없습니다.\n2. 사후에 만 14세 미만임이 확인되는 경우 이용을 제한하고 수집된 개인정보(촬영 이미지 포함)를 지체 없이 파기합니다.',
        ],
      },
      {
        heading: '제3조 (확인 방법)',
        paragraphs: [
          '회원가입 시 생년월일 입력으로 연령을 확인하며, 필요 시 추가 인증 절차를 요구할 수 있습니다.',
        ],
      },
    ],
  },
};

function MyPolicyDetailPage() {
  const { policyType } = useParams();
  if (!policyType || !(policyType in POLICY_DETAILS)) {
    return <Navigate to="/my/policies" replace />;
  }
  const policy = POLICY_DETAILS[policyType as PolicySlug];

  return (
    <MyPageLayout title="약관 및 정책" contentClassName="flex flex-col items-center pt-2">
      <article
        className={`box-border flex flex-col gap-2 rounded-[10px] border border-gray-100 bg-card ${policy.cardClassName}`}
      >
        <h2 className="h-[33px] border-b border-gray-100 pb-2 text-title-2 leading-6">
          {policy.title}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="rounded-lg bg-main-50 px-[14px] py-3 text-caption leading-[14px] text-text-secondary">
              {policy.notice}
            </p>
            <div className="flex flex-col gap-8">
              {policy.sections.map((section) => (
                <section key={section.heading} className="flex flex-col gap-2">
                  <h3 className="text-title-3 leading-[21px]">{section.heading}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="whitespace-pre-line text-body-small leading-[17px] text-text-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
          {policy.footer && (
            <p className="rounded-lg bg-gray-50 px-[14px] py-3 text-caption leading-[14px] text-text-secondary">
              {policy.footer}
            </p>
          )}
        </div>
      </article>
    </MyPageLayout>
  );
}

export default MyPolicyDetailPage;
