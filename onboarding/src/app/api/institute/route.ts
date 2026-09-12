import { NextResponse } from 'next/server';
import { verifyStudentCredential } from '@/lib/sheerIdVerifier';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instituteName, studentId } = body;

    const verification = verifyStudentCredential(
      instituteName || 'Delhi Public School',
      studentId || 'STU-99210'
    );

    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error('Institute verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify institute credentials' },
      { status: 500 }
    );
  }
}
