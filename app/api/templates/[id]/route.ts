import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const input = (await request.json()) as Record<string, unknown>;
  try {
    return proxyJson(
      await outreachRequest(`/api/templates/${encodeURIComponent(id)}`, {
        method: 'PUT',
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
    console.error('[api/templates/:id] failed to update template', error);
    return NextResponse.json(
      { error: 'Não foi possível atualizar o modelo no backend.' },
      { status: 502 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    return proxyJson(
      await outreachRequest(`/api/templates/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
    );
  } catch (error) {
    console.error('[api/templates/:id] failed to delete template', error);
    return NextResponse.json(
      { error: 'Não foi possível excluir o modelo no backend.' },
      { status: 502 },
    );
  }
}
