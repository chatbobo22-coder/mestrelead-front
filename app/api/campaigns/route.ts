import { NextResponse } from 'next/server';
import { outreachRequest, proxyJson } from '@/lib/outreach-api';

export const dynamic = 'force-dynamic';

type DashboardCampaign = {
  campaign_id: number;
  name: string;
  campaign_status: string;
  template_id?: number | null;
  template_name?: string | null;
  subject_template?: string | null;
  daily_limit?: number;
  messages_total?: number;
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  replied?: number;
  bounced?: number;
};

export async function GET() {
  try {
    const response = await outreachRequest('/api/dashboard');
    if (!response.ok) return proxyJson(response);
    const data = (await response.json()) as {
      campaigns?: DashboardCampaign[];
    };
    const campaigns = (data.campaigns ?? []).map((item) => ({
      id: item.campaign_id,
      name: item.name,
      template_id: item.template_id,
      template_name: item.template_name ?? undefined,
      subject: item.subject_template ?? '',
      audience: `${Number(item.messages_total ?? 0)} contatos`,
      status: item.campaign_status,
      daily_limit: Number(item.daily_limit ?? 30),
      sent_count: Number(item.sent ?? 0),
      delivered_count: Number(item.delivered ?? item.sent ?? 0),
      opened_count: Number(item.opened ?? 0),
      clicked_count: Number(item.clicked ?? 0),
      replied_count: Number(item.replied ?? 0),
      bounced_count: Number(item.bounced ?? 0),
    }));
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('[api/campaigns] failed to load dashboard', error);
    return NextResponse.json(
      { error: 'O backend de outreach não respondeu.' },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const input = (await request.json()) as Record<string, unknown>;
  try {
    const response = await outreachRequest('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        subject_template: input.subject,
        body_template: input.textBody,
        body_html_template: input.htmlBody,
        template_id: input.templateId ? Number(input.templateId) : null,
        daily_limit: Number(input.dailyLimit || 30),
        audience_mode: input.audienceMode || 'all',
        audience_qualities: input.audienceQualities || ['A', 'B'],
        min_score:
          input.minScore === '' || input.minScore == null
            ? null
            : Number(input.minScore),
        max_score:
          input.maxScore === '' || input.maxScore == null
            ? null
            : Number(input.maxScore),
        scheduled_at: input.scheduledAt || null,
      }),
    });
    if (!response.ok) return proxyJson(response);
    const data = (await response.json()) as {
      id: number;
      audience?: { total?: number };
    };
    return NextResponse.json(
      {
        campaign: {
          id: data.id,
          name: input.name,
          subject: input.subject,
          audience: `${Number(data.audience?.total ?? 0)} contatos`,
          status: 'draft',
          daily_limit: Number(input.dailyLimit || 30),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[api/campaigns] failed to create campaign', error);
    return NextResponse.json(
      { error: 'Não foi possível criar a campanha no backend.' },
      { status: 502 },
    );
  }
}
