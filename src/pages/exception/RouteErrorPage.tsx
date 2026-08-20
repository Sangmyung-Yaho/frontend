import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '../../components/common';

function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '페이지를 불러오는 중 문제가 발생했어요.';

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <section className="w-full max-w-[361px] rounded-[10px] border border-gray-100 bg-card p-6 text-center">
        <h1 className="text-title-2 leading-normal text-text-primary">잠시 후 다시 시도해주세요.</h1>
        <p className="mt-3 text-body-small leading-5 text-text-secondary">{message}</p>
        <Button className="mt-6" onClick={() => window.location.assign('/')}>
          홈으로 가기
        </Button>
      </section>
    </main>
  );
}

export default RouteErrorPage;
