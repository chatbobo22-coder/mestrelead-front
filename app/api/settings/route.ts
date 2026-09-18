import { NextResponse } from 'next/server';
import { outreachRequest } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await outreachRequest('/health');
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);
    const health = (await response.json()) as { dry_run?: boolean };
    return NextResponse.json({
      settings: { provider: 'sendpulse_smtp', dry_run: health.dry_run ?? true },
    });
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
