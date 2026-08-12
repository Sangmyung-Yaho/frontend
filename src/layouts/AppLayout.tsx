import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393px]">
      <Outlet />
    </div>
  );
};

export default AppLayout;
