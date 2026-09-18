import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const templates = sqliteTable(
  'templates',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    subject: text('subject').notNull(),
    preheader: text('preheader').notNull().default(''),
    textBody: text('text_body').notNull(),
    htmlBody: text('html_body').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('idx_templates_updated_at').on(table.updatedAt)],
);

export const campaigns = sqliteTable(
  'campaigns',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    templateId: integer('template_id').references(() => templates.id),
    subject: text('subject').notNull().default(''),
    audience: text('audience').notNull(),
    status: text('status').notNull().default('draft'),
    scheduledAt: text('scheduled_at'),
    dailyLimit: integer('daily_limit').notNull().default(30),
    sentCount: integer('sent_count').notNull().default(0),
    deliveredCount: integer('delivered_count').notNull().default(0),
    openedCount: integer('opened_count').notNull().default(0),
    clickedCount: integer('clicked_count').notNull().default(0),
    repliedCount: integer('replied_count').notNull().default(0),
    bouncedCount: integer('bounced_count').notNull().default(0),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_campaigns_status_updated_at').on(table.status, table.updatedAt),
  ],
);

export const contacts = sqliteTable(
  'contacts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    company: text('company').notNull(),
    email: text('email').notNull().unique(),
    status: text('status').notNull().default('ready'),
    score: integer('score'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('idx_contacts_status').on(table.status)],
);

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  provider: text('provider').notNull().default('sendpulse_smtp'),
  fromName: text('from_name').notNull().default('Tironi Tech'),
  fromEmail: text('from_email').notNull().default(''),
  replyTo: text('reply_to').notNull().default(''),
  dailyLimit: integer('daily_limit').notNull().default(30),
  hourlyLimit: integer('hourly_limit').notNull().default(10),
  domainDailyLimit: integer('domain_daily_limit').notNull().default(2),
  intervalSeconds: integer('interval_seconds').notNull().default(360),
  sendStartHour: integer('send_start_hour').notNull().default(9),
  sendEndHour: integer('send_end_hour').notNull().default(17),
  requireApproval: integer('require_approval', { mode: 'boolean' })
    .notNull()
    .default(true),
  dryRun: integer('dry_run', { mode: 'boolean' }).notNull().default(true),
  updatedAt: text('updated_at').notNull(),
});

export const deliveryEvents = sqliteTable(
  'delivery_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    campaignId: integer('campaign_id').references(() => campaigns.id),
    messageId: text('message_id'),
    recipient: text('recipient').notNull(),
    eventType: text('event_type').notNull(),
    providerEventId: text('provider_event_id').unique(),
    occurredAt: text('occurred_at').notNull(),
    payload: text('payload').notNull().default('{}'),
  },
  (table) => [
    index('idx_delivery_events_campaign_time').on(
      table.campaignId,
      table.occurredAt,
    ),
  ],
);
