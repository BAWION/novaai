import React from 'react';
import { TimeSavedPage } from '@/components/time-saved/TimeSavedPage';
import { PageLayout } from '@/components/layout/page-layout';

export default function TimeSavedPageRoute() {
  return (
    <PageLayout>
      <TimeSavedPage />
    </PageLayout>
  );
}