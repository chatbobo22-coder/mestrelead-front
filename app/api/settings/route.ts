import { NextResponse } from 'next/server';
import { outreachRequest } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await outreachRequest('/api/settings');
    if (!response.ok)
      return new Response(await response.text(), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('[api/settings] failed to load settings', error);
    return NextResponse.json(
      { error: 'O backend de outreach não respondeu.' },
      { status: 502 },
    );
  }
}

export async function PUT() {
  return NextResponse.json(
    {
      error:
        'As configurações operacionais são controladas pelas variáveis do backend.',
    },
    { status: 409 },
  );
}
