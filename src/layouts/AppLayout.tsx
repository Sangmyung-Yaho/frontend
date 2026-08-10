import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393ppx]">
      <Outlet />
    </div>
  );
};

export default AppLayout;
