import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const isTouchDevice =
    typeof navigator !== 'undefined' &&
    (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

  return (
    <div
      className={`relative mx-auto min-h-dvh w-screen overflow-x-hidden bg-background px-4 [&>main]:min-h-dvh [&>main]:w-full ${
        isTouchDevice ? 'max-w-none' : 'max-w-[393px]'
      }`}
    >
      <Outlet />
    </div>
  );
};

export default AppLayout;
