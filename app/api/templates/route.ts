import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return proxyJson(await outreachRequest('/api/templates'));
  } catch (error) {
    console.error('[api/templates] failed to load templates', error);
    return NextResponse.json(
      { error: 'O backend de outreach não respondeu.' },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const input = (await request.json()) as Record<string, unknown>;
  try {
    return proxyJson(
      await outreachRequest('/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          subject: input.subject,
          preheader: input.preheader ?? '',
          text_body: input.textBody,
          html_body: input.htmlBody,
        }),
      }),
    );
  } catch (error) {
    console.error('[api/templates] failed to create template', error);
    return NextResponse.json(
      { error: 'Não foi possível salvar o modelo no backend.' },
      { status: 502 },
    );
  }
}
