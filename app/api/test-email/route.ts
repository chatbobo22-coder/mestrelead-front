import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    return proxyJson(
      await outreachRequest('/api/test-email', {
        method: 'POST',
        body: JSON.stringify({
          template_id: Number(input.templateId),
          email: input.email,
          company_name: input.companyName || 'Empresa de teste',
        }),
      }),
    );
  } catch (error) {
    console.error('[api/test-email] failed', error);
    return NextResponse.json(
      { error: 'Não foi possível enviar o e-mail de teste.' },
      { status: 502 },
    );
  }
}
