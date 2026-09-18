import { NextResponse } from 'next/server';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { nowIso, outreachDb } from '@/lib/outreach-db';

export const dynamic = 'force-dynamic';

async function authorized() {
  return (await getChatGPTUser()) || process.env.NODE_ENV !== 'production';
}

export async function GET() {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const result = await outreachDb()
    .prepare(
      `SELECT t.*,
        COALESCE(SUM(c.sent_count), 0) AS sent_count,
        COALESCE(SUM(c.opened_count), 0) AS opened_count,
        COALESCE(SUM(c.clicked_count), 0) AS clicked_count,
        COALESCE(SUM(c.replied_count), 0) AS replied_count
       FROM templates t
       LEFT JOIN campaigns c ON c.template_id=t.id
       GROUP BY t.id
       ORDER BY t.updated_at DESC`,
    )
    .all();
  return NextResponse.json({ templates: result.results });
}

export async function POST(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const input = (await request.json()) as Record<string, unknown>;
  const name = String(input.name ?? '').trim();
  const subject = String(input.subject ?? '').trim();
  const preheader = String(input.preheader ?? '').trim();
  const textBody = String(input.textBody ?? '').trim();
  const htmlBody = String(input.htmlBody ?? '').trim();
  if (
    name.length < 3 ||
    subject.length < 3 ||
    textBody.length < 10 ||
    htmlBody.length < 10
  ) {
    return NextResponse.json(
      { error: 'Preencha nome, assunto e conteúdo do modelo.' },
      { status: 400 },
    );
  }
  const now = nowIso();
  const result = await outreachDb()
    .prepare(
      'INSERT INTO templates (name,subject,preheader,text_body,html_body,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) RETURNING *',
    )
    .bind(name, subject, preheader, textBody, htmlBody, 'active', now, now)
    .first();
  return NextResponse.json({ template: result }, { status: 201 });
}
