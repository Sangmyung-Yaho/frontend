import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader, BottomNavigation, type NavigationItem } from '../../layouts';

interface MyPageLayoutProps {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  contentClassName?: string;
}

function MyPageLayout({
  title,
  children,
  showBack = true,
  contentClassName = '',
}: MyPageLayoutProps) {
  const navigate = useNavigate();
  const handleNavigation = (item: NavigationItem) => {
    const routeByItem: Record<NavigationItem, string> = {
      home: '/home',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
  };

  return (
    <main className="relative min-h-dvh bg-background text-text-primary">
      <div className="h-[env(safe-area-inset-top)]" aria-hidden="true" />
      {showBack ? (
        <BackHeader
          title={title}
          onBack={() => navigate(-1)}
          className="-mx-4 !h-14 !w-[calc(100%+32px)] px-4 !pt-4"
        />
      ) : (
        <header className="-mx-4 flex h-14 w-[calc(100%+32px)] items-center px-4">
          <h1 className="text-title-2 leading-6">{title}</h1>
        </header>
      )}
      <div className={`w-[361px] ${contentClassName}`}>{children}</div>
      <BottomNavigation
        activeItem="my"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

export default MyPageLayout;
