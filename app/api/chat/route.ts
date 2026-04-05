import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, getExpert } from '@/lib/wiki-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertId, message } = body;

    if (!expertId || !message) {
      return NextResponse.json({ error: 'Expert ID and message are required' }, { status: 400 });
    }

    const expert = await getExpert(expertId);
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    const { response, gaps } = await generateResponse(expertId, message);
    
    return NextResponse.json({ response, gaps });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
