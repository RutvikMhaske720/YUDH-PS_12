import { NextResponse } from 'next/server';
import { routeAndExecuteQuery } from '@/lib/agents/coordinatorAgent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, profile } = body;

    const responseMessage = routeAndExecuteQuery(query || 'Help me solve kinetic energy derivative', profile || {});

    return NextResponse.json({
      success: true,
      message: responseMessage,
    });
  } catch (error) {
    console.error('Tutor route execution error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process tutor query' },
      { status: 500 }
    );
  }
}
