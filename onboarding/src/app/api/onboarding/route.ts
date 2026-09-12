import { NextResponse } from 'next/server';
import { processOnboardingData } from '@/lib/onboardingProcessor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const processed = processOnboardingData(body);

    return NextResponse.json({
      success: true,
      message: 'Onboarding data processed and saved to session context.',
      data: processed,
    });
  } catch (error) {
    console.error('Onboarding processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process onboarding payload' },
      { status: 500 }
    );
  }
}
