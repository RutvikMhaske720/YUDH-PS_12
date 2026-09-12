import React, { Suspense } from 'react';
import OnboardingWizard from '@/components/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <div className="py-12 bg-[#FAF7F2] min-h-[85vh]">
      <div className="wrap">
        <Suspense fallback={
          <div className="text-center py-20 font-mono text-sm text-[#3E4F49]">
            Loading Phoenix Onboarding Engine...
          </div>
        }>
          <OnboardingWizard />
        </Suspense>
      </div>
    </div>
  );
}
