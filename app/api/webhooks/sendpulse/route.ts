import { NextResponse } from 'next/server';
import { outreachDb } from '@/lib/outreach-db';

export const dynamic = 'force-dynamic';

type SendPulseEvent = {
  event?: string;
  timestamp?: string | number;
  task_id?: string | number;
  message_id?: string | number;
  email?: string;
  recipient?: string;
  subject?: string;
};

const eventColumn: Record<string, string> = {
  delivered: 'delivered_count',
  opened: 'opened_count',
  open: 'opened_count',
  clicked: 'clicked_count',
  click: 'clicked_count',
  undelivered: 'bounced_count',
  bounce: 'bounced_count',
  hard_bounce: 'bounced_count',
  soft_bounce: 'bounced_count',
};

export async function POST(request: Request) {
  const configuredSecret = process.env.SENDPULSE_WEBHOOK_SECRET;
  const suppliedSecret =
    request.headers.get('x-webhook-secret') ??
    new URL(request.url).searchParams.get('secret');
  if (configuredSecret && suppliedSecret !== configuredSecret) {
    return NextResponse.json(
      { error: 'Assinatura inválida.' },
      { status: 401 },
    );
  }

  const body = (await request.json()) as SendPulseEvent[] | SendPulseEvent;
  const events = Array.isArray(body) ? body : [body];
  let accepted = 0;

  for (const item of events) {
    const eventType = String(item.event ?? '').toLowerCase();
    const column = eventColumn[eventType];
    const recipient = String(item.recipient ?? item.email ?? '').trim();
    if (!column || !recipient) continue;

    const taskId = String(item.task_id ?? '');
    const messageId = String(item.message_id ?? item.task_id ?? '');
    const occurredAt = item.timestamp
      ? new Date(Number(item.timestamp) * 1000).toISOString()
      : new Date().toISOString();
    const campaign = item.subject
      ? await outreachDb()
          .prepare(
            'SELECT id FROM campaigns WHERE subject=? ORDER BY updated_at DESC LIMIT 1',
          )
          .bind(String(item.subject))
          .first<{ id: number }>()
      : null;
    const providerEventId = [
      eventType,
      messageId || taskId,
      recipient,
      item.timestamp,
    ].join(':');
    const inserted = await outreachDb()
      .prepare(
        'INSERT OR IGNORE INTO delivery_events (campaign_id,message_id,recipient,event_type,provider_event_id,occurred_at,payload) VALUES (?,?,?,?,?,?,?)',
      )
      .bind(
        campaign?.id ?? null,
        messageId || null,
        recipient,
        eventType,
        providerEventId,
        occurredAt,
        JSON.stringify(item),
      )
      .run();
    if (!inserted.meta.changes) continue;
    accepted += 1;
    if (campaign?.id) {
      await outreachDb()
        .prepare(
          `UPDATE campaigns SET ${column}=${column}+1,updated_at=? WHERE id=?`,
        )
        .bind(new Date().toISOString(), campaign.id)
        .run();
    }
  }

  return NextResponse.json({ received: events.length, accepted });
}
