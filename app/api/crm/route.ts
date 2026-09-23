import { NextRequest, NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    const path = query ? `/api/crm?q=${encodeURIComponent(query)}` : '/api/crm';
    return proxyJson(await outreachRequest(path));
  } catch (error) {
    console.error('[api/crm] failed to load cases', error);
    return NextResponse.json(
      { error: 'O backend de CRM não respondeu.' },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return proxyJson(
      await outreachRequest('/api/crm', {
        method: 'POST',
        body: JSON.stringify(await request.json()),
      }),
    );
  } catch (error) {
    console.error('[api/crm] failed to create case', error);
    return NextResponse.json(
      { error: 'Não foi possível iniciar o atendimento.' },
      { status: 502 },
    );
  }
}
