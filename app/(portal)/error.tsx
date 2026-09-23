'use client';

import { ErrorState } from '@/components/portal/States';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState onRetry={retry} />;
}
