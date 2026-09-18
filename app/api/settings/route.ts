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
  const row = await outreachDb()
    .prepare('SELECT * FROM settings WHERE id=1')
    .first();
  return NextResponse.json({ settings: row });
}

export async function PUT(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const input = (await request.json()) as Record<string, unknown>;
  const now = nowIso();
  const statement = outreachDb().prepare(
    `INSERT INTO settings (id,provider,from_name,from_email,reply_to,daily_limit,hourly_limit,domain_daily_limit,interval_seconds,send_start_hour,send_end_hour,require_approval,dry_run,updated_at)
     VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET provider=excluded.provider,from_name=excluded.from_name,from_email=excluded.from_email,reply_to=excluded.reply_to,daily_limit=excluded.daily_limit,hourly_limit=excluded.hourly_limit,domain_daily_limit=excluded.domain_daily_limit,interval_seconds=excluded.interval_seconds,send_start_hour=excluded.send_start_hour,send_end_hour=excluded.send_end_hour,require_approval=excluded.require_approval,dry_run=excluded.dry_run,updated_at=excluded.updated_at
     RETURNING *`,
  );
  const row = await statement
    .bind(
      'sendpulse_smtp',
      String(input.fromName ?? 'Tironi Tech'),
      String(input.fromEmail ?? ''),
      String(input.replyTo ?? ''),
      Number(input.dailyLimit ?? 30),
      Number(input.hourlyLimit ?? 10),
      Number(input.domainDailyLimit ?? 2),
      Number(input.intervalSeconds ?? 360),
      Number(input.sendStartHour ?? 9),
      Number(input.sendEndHour ?? 17),
      Boolean(input.requireApproval),
      Boolean(input.dryRun),
      now,
    )
    .first();
  return NextResponse.json({ settings: row });
}
