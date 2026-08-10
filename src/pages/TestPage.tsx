import { useState } from 'react';
import { Button, Checkbox, Radio, ToggleSwitch } from '../components/common';
import { BottomNavigation, type NavigationItem } from '../layouts';
import BackHeader from '../layouts/BackHeader';

function TestPage() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState<NavigationItem>('home');
  const [message, setMessage] = useState('버튼을 눌러 동작을 확인해 보세요.');

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="mb-8">
          <p className="mb-2 text-caption-3 text-main-600">COMMON COMPONENT</p>
          <h1 className="text-display">Components</h1>
          <p className="mt-3 text-body leading-6 text-text-secondary">
            버튼과 선택 컴포넌트의 상태를 직접 확인할 수 있습니다.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl bg-card py-5 shadow-sm">
          <h2 className="mb-4 px-5 text-title-3">Back Header</h2>
          <BackHeader title="약관 동의" onBack={() => setMessage('뒤로 가기를 눌렀습니다.')} />
        </section>

        <section className="overflow-hidden rounded-2xl bg-card py-5 shadow-sm">
          <h2 className="mb-4 px-5 text-title-3">Bottom Navigation</h2>
          <BottomNavigation activeItem={activeNavigation} onChange={setActiveNavigation} />
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-title-3">Toggle</h2>
          <div className="space-y-6">
            <ToggleSwitch
              aria-label="스위치 토글"
              checked={switchChecked}
              onChange={(event) => setSwitchChecked(event.target.checked)}
            />
            <p> </p>
            <Radio
              aria-label="라디오 토글"
              name="toggle-test"
              checked={radioChecked}
              onClick={() => setRadioChecked((checked) => !checked)}
              onChange={() => undefined}
            />
            <p> </p>
            <Checkbox
              aria-label="체크박스 토글"
              checked={checkboxChecked}
              onChange={(event) => setCheckboxChecked(event.target.checked)}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-title-3">Primary</h2>
          <div className="space-y-5">
            <Button disabled>다음</Button>
            <Button onClick={() => setMessage('다음 버튼을 눌렀습니다.')}>다음</Button>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-title-3">Danger</h2>
          <div className="space-y-5">
            <Button variant="danger" disabled>
              탈퇴하기
            </Button>
            <Button variant="danger" onClick={() => setMessage('탈퇴하기 버튼을 눌렀습니다.')}>
              탈퇴하기
            </Button>
          </div>
        </section>

        <p
          aria-live="polite"
          className="rounded-xl bg-main-50 px-4 py-3 text-body-small leading-5 text-main-800"
        >
          {message}
        </p>
      </div>
    </main>
  );
}

export default TestPage;
