import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return proxyJson(await outreachRequest('/api/contacts'));
  } catch (error) {
    console.error('[api/contacts] failed to load contacts', error);
    return NextResponse.json(
      { error: 'O backend de outreach não respondeu.' },
      { status: 502 },
    );
  }
}
