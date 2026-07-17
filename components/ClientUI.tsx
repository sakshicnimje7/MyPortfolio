'use client';

import AnalyticsTracker from '@/components/AnalyticsTracker';
import ThemeToggle from '@/components/ui/ThemeToggle';
import FloatingNav from '@/components/ui/FloatingNav';
import PageLoader from '@/components/ui/PageLoader';
import CustomCursor from '@/components/ui/CustomCursor';

export default function ClientUI() {
  return (
    <>
      <AnalyticsTracker />
      <ThemeToggle />
      <FloatingNav />
      <PageLoader />
      <CustomCursor />
    </>
  );
}
