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
      'SELECT c.*,t.name AS template_name FROM campaigns c LEFT JOIN templates t ON t.id=c.template_id ORDER BY c.updated_at DESC',
    )
    .all();
  return NextResponse.json({ campaigns: result.results });
}

export async function POST(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const input = (await request.json()) as Record<string, unknown>;
  const name = String(input.name ?? '').trim();
  const audience = String(input.audience ?? '').trim();
  if (name.length < 3 || audience.length < 2)
    return NextResponse.json(
      { error: 'Preencha campanha e público.' },
      { status: 400 },
    );
  const now = nowIso();
  const result = await outreachDb()
    .prepare(
      'INSERT INTO campaigns (name,template_id,subject,audience,status,scheduled_at,daily_limit,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) RETURNING *',
    )
    .bind(
      name,
      input.templateId && Number(input.templateId) > 0
        ? Number(input.templateId)
        : null,
      String(input.subject ?? '').trim(),
      audience,
      'draft',
      input.scheduledAt || null,
      Number(input.dailyLimit || 30),
      now,
      now,
    )
    .first();
  return NextResponse.json({ campaign: result }, { status: 201 });
}
