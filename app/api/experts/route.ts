import { NextRequest, NextResponse } from 'next/server';
import { getExperts, createExpert, getExpert, updateExpert, deleteExpert } from '@/lib/wiki-engine';

export async function GET() {
  try {
    const experts = await getExperts();
    return NextResponse.json(experts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch experts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bio, avatar } = body;

    if (!name || !bio) {
      return NextResponse.json({ error: 'Name and bio are required' }, { status: 400 });
    }

    const expert = await createExpert({ name, bio, avatar: avatar || '' });
    return NextResponse.json(expert, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create expert' }, { status: 500 });
  }
}
