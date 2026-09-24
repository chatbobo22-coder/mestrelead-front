import { NextResponse } from 'next/server';
import { injectorRequest, proxyInjectorJson } from '@/lib/injector-api';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cnpj: string }> },
) {
  try {
    const { cnpj } = await params;
    return proxyInjectorJson(
      await injectorRequest(`/api/opportunities/${encodeURIComponent(cnpj)}`),
    );
  } catch (error) {
    console.error('[api/opportunities/cnpj] failed', error);
    return NextResponse.json({ error: 'A inteligência do lead não respondeu.' }, { status: 502 });
  }
}
