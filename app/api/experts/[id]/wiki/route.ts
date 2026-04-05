import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, updateWikiContent, getExpert } from '@/lib/wiki-engine';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const expert = await getExpert(id);
    
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    const wiki = await getWikiContent(id);
    return NextResponse.json(wiki);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch wiki content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const expert = await getExpert(id);
    
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    const body = await request.json();
    const { section, content } = body;

    if (!section || content === undefined) {
      return NextResponse.json({ error: 'Section and content are required' }, { status: 400 });
    }

    const validSections = ['definitions', 'taxonomy', 'connections', 'gaps'];
    if (!validSections.includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    await updateWikiContent(id, section, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update wiki content' }, { status: 500 });
  }
}
