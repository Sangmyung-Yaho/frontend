import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="app-shell relative mx-auto min-h-dvh w-full overflow-x-hidden bg-background px-4 [&>main]:min-h-dvh [&>main]:w-full">
      <Outlet />
    </div>
  );
};

export default AppLayout;
