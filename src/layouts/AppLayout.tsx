import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-none overflow-x-hidden bg-background px-4 sm:max-w-[393px] [&>main]:min-h-dvh [&>main]:w-full">
      <Outlet />
    </div>
  );
};

export default AppLayout;
