import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="relative mx-auto min-h-dvh w-screen max-w-none overflow-x-hidden bg-background px-4 lg:max-w-[393px] [&>main]:min-h-dvh">
      <Outlet />
    </div>
  );
};

export default AppLayout;
