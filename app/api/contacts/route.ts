import { NextRequest, NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const target = new URL('/api/contacts', 'https://outreach.local');
    for (const key of ['page', 'page_size', 'q']) {
      const value = request.nextUrl.searchParams.get(key);
      if (value) target.searchParams.set(key, value);
    }
    return proxyJson(
      await outreachRequest(`${target.pathname}${target.search}`),
    );
  } catch (error) {
    console.error('[api/contacts] failed to load contacts', error);
    return NextResponse.json(
      { error: 'O backend de outreach não respondeu.' },
      { status: 502 },
    );
  }
}
