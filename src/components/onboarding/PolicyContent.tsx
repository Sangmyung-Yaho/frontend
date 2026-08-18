import { useEffect, useState } from 'react';
import { getPolicies, type Policy, type PolicyType } from '../../api/policies';

interface PolicyContentProps {
  type: PolicyType;
}

function PolicyContent({ type }: PolicyContentProps) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void getPolicies(type, controller.signal)
      .then(({ data }) => {
        const matchingPolicy = data.data.find((item) => item.type === type) ?? null;
        setPolicy(matchingPolicy);
        setHasError(!matchingPolicy);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPolicy(null);
          setHasError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [retryCount, type]);

  if (isLoading) {
    return (
      <div className="flex min-h-[160px] items-center justify-center text-body-small text-text-secondary">
        약관 내용을 불러오는 중이에요.
      </div>
    );
  }

  if (hasError || !policy) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-center">
        <p role="alert" className="text-body-small text-text-secondary">
          약관 내용을 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            setHasError(false);
            setRetryCount((count) => count + 1);
          }}
          className="text-caption-3 text-main-600 underline underline-offset-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <article className="flex w-full flex-col gap-3">
      <p className="whitespace-pre-wrap break-words text-body-small leading-[1.45] text-gray-300">
        {policy.content}
      </p>
      <p className="text-right text-caption text-text-secondary">버전 {policy.version}</p>
    </article>
  );
}

export default PolicyContent;
