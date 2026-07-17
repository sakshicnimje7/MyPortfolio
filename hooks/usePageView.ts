'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin')) {
      trackPageView(pathname);
    }
  }, [pathname]);
}
