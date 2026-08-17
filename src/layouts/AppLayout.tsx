import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[393px] overflow-x-hidden bg-background px-4 [&>main]:min-h-dvh [&>main]:w-full">
      <Outlet />
    </div>
  );
};

export default AppLayout;
