type PolicyContentType = 'TERMS' | 'PRIVACY' | 'AGE';

interface PolicySection {
  heading: string;
  content: string;
}

interface StaticPolicyContent {
  notice: string;
  sections: PolicySection[];
  footer?: string;
  compactNotice?: boolean;
}

interface PolicyContentProps {
  type: PolicyContentType;
}

const POLICY_CONTENT: Record<PolicyContentType, StaticPolicyContent> = {
  TERMS: {
    notice:
      '본 서비스가 제공하는 피부 분석 리포트는 의료행위·진단이 아닌 참고용 웰니스 정보입니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        content:
          '본 약관은 바로케어의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (정의)',
        content:
          '· 서비스 — 생활습관 데이터와 얼굴(피부) 이미지를 AI로 통합 분석해 피부 리포트·루틴을 제공하는 서비스\n· 체크인 — 매일 입력하는 수면·스트레스·물 섭취·피부촬영 활동 데이터\n· 리포트 — 체크인과 촬영 이미지를 바탕으로 산출되는 분석 결과물',
      },
      {
        heading: '제5조 (의료서비스가 아님에 대한 고지)',
        content:
          '1. 피부 분석 리포트·등급·루틴 미션 등 모든 콘텐츠는 참고용 웰니스 정보이며, 「의료법」상 의료행위·진단·처방·치료에 해당하지 않습니다.\n2. 서비스는 의료인의 진료·상담·처방을 대체하지 않습니다.\n3. 이상 증상이 있는 경우 반드시 의료기관을 방문해 전문의 진료를 받아야 합니다.',
      },
    ],
    footer:
      '제6~11조(회원가입, 의무, 유료서비스, 면책, 관할법원)는 전문 문서에서 전체 확인 가능합니다.',
  },
  PRIVACY: {
    notice:
      '얼굴(피부) 촬영 이미지는 신원확인·생체인증이 아닌 피부 지표 분석 목적으로만 사용됩니다.',
    sections: [
      {
        heading: '1. 수집 항목',
        content:
          '· 필수 — 계정정보(이메일/비밀번호), 키·몸무게, 체크인 데이터(수면·스트레스·물 섭취), 얼굴(피부) 촬영 이미지, 서비스 이용기록·접속 로그·기기정보\n· 선택 — 피부타입, 온보딩 시 얼굴 사진',
      },
      {
        heading: '2. 얼굴(피부) 촬영 이미지 특별 고지',
        content:
          '· 온보딩 촬영은 선택, 일일 체크인 촬영은 리포트 생성을 위한 필수 입력\n· 신원확인·생체인증 목적 사용 안 함 — 피부 지표 분석·시점 비교 전용\n· AI 분석 외부 위탁 시 수탁업체·업무 내용 사전 고지\n· 마이페이지에서 언제든지 열람·삭제 요청 가능',
      },
    ],
    footer: '보유기간은 3년이며, 촬영 이미지는 3년 경과 시 지체 없이 파기됩니다.',
  },
  AGE: {
    notice: '본 서비스는 만 14세 이상만 가입 및 이용할 수 있습니다.',
    compactNotice: true,
    sections: [
      {
        heading: '제2조 (이용 연령 제한)',
        content:
          '1. 만 14세 미만 아동은 법정대리인 동의 여부와 관계없이 가입할 수 없습니다.\n2. 사후에 만 14세 미만임이 확인되는 경우 이용을 제한하고 수집된 개인정보(촬영 이미지 포함)를 지체 없이 파기합니다.',
      },
      {
        heading: '제3조 (확인 방법)',
        content:
          '회원가입 시 생년월일 입력으로 연령을 확인하며, 필요 시 추가 인증 절차를 요구할 수 있습니다.',
      },
    ],
  },
};

function PolicyContent({ type }: PolicyContentProps) {
  const policy = POLICY_CONTENT[type];

  return (
    <div className="flex w-[333px] max-w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <aside
          className={`flex w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-main-50 p-3 ${
            policy.compactNotice ? '' : 'h-[52px]'
          }`}
        >
          <p className="w-[305px] max-w-full text-caption leading-[14px] text-text-secondary">
            {policy.notice}
          </p>
        </aside>

        <div className="flex w-full flex-col gap-8">
          {policy.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-2">
              <h3 className="text-title-3 leading-[21px] text-text-primary">{section.heading}</h3>
              <p className="whitespace-pre-line text-body-small leading-[17px] text-gray-300">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>

      {policy.footer && (
        <aside className="flex h-[52px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-3">
          <p className="w-[305px] max-w-full text-caption leading-[14px] text-text-secondary">
            {policy.footer}
          </p>
        </aside>
      )}
    </div>
  );
}

export default PolicyContent;
