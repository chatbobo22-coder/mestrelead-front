import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { nowIso, outreachDb } from '@/lib/outreach-db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getChatGPTUser()) && process.env.NODE_ENV === 'production')
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { id } = await params;
  const input = (await request.json()) as Record<string, unknown>;
  const result = await outreachDb()
    .prepare(
      'UPDATE templates SET name=?,subject=?,preheader=?,text_body=?,html_body=?,updated_at=? WHERE id=? RETURNING *',
    )
    .bind(
      String(input.name ?? '').trim(),
      String(input.subject ?? '').trim(),
      String(input.preheader ?? '').trim(),
      String(input.textBody ?? '').trim(),
      String(input.htmlBody ?? '').trim(),
      nowIso(),
      Number(id),
    )
    .first();
  if (!result)
    return NextResponse.json(
      { error: 'Modelo não encontrado' },
      { status: 404 },
    );
  return NextResponse.json({ template: result });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getChatGPTUser()) && process.env.NODE_ENV === 'production')
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { id } = await params;
  const inUse = await outreachDb()
    .prepare('SELECT count(*) AS total FROM campaigns WHERE template_id=?')
    .bind(Number(id))
    .first<{ total: number }>();
  if ((inUse?.total ?? 0) > 0)
    return NextResponse.json(
      { error: 'Modelo utilizado por uma campanha.' },
      { status: 409 },
    );
  await outreachDb()
    .prepare('DELETE FROM templates WHERE id=?')
    .bind(Number(id))
    .run();
  return NextResponse.json({ deleted: true });
}
