'use client';

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Columns3,
  Database,
  Eye,
  FileText,
  Gauge,
  Mail,
  MoreHorizontal,
  Sparkles,
  Flame,
  Pause,
  Play,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Square,
  Users,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { IntentEngine } from '@/components/intent-engine';

type View =
  | 'overview'
  | 'campaigns'
  | 'templates'
  | 'contacts'
  | 'crm'
  | 'smart-search'
  | 'commercial-priority'
  | 'queue'
  | 'reports'
  | 'injector'
  | 'settings';
type Template = {
  id: number;
  name: string;
  subject: string;
  preheader?: string;
  text_body: string;
  html_body: string;
  updated_at: string;
  sent_count?: number;
  opened_count?: number;
  clicked_count?: number;
  replied_count?: number;
};
type Campaign = {
  id: number;
  name: string;
  template_name?: string;
  audience: string;
  status: string;
  scheduled_at?: string;
  daily_limit: number;
  subject?: string;
  sent_count?: number;
  delivered_count?: number;
  opened_count?: number;
  clicked_count?: number;
  replied_count?: number;
  bounced_count?: number;
};
type Contact = {
  id: number;
  company: string;
  company_name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  score: number;
  confidence_score: number;
  lead_quality: string;
  profile_score: number;
  data_confidence_score: number;
  qualification_reasons: string[];
  contact_role?: string | null;
  status: string;
  last_subject?: string | null;
  opens: number;
};
type ContactMetrics = {
  total: number;
  quality_a: number;
  quality_b: number;
  with_whatsapp: number;
  public_profile: number;
  average_score: number;
};
type ContactPage = {
  contacts: Contact[];
  metrics: ContactMetrics;
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};
type CrmStage =
  | 'ready'
  | 'contacted'
  | 'replied'
  | 'qualified'
  | 'meeting'
  | 'proposal'
  | 'won'
  | 'lost';
type CrmServiceType =
  | 'prospecting'
  | 'qualification'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'follow_up'
  | 'reactivation'
  | 'after_sales';
type CrmCase = {
  id: number;
  lead_id: number;
  company: string;
  company_name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  score: number;
  lead_quality: string;
  service_type: CrmServiceType;
  stage: CrmStage;
  owner_name?: string | null;
  notes?: string | null;
  next_action_at?: string | null;
  updated_at: string;
};
type LeadDetail = {
  lead: Contact & {
    cnpj: string;
    trade_name?: string | null;
    source_payload?: Record<string, unknown>;
    natureza_juridica_descricao?: string | null;
    porte?: string | null;
    identificador_matriz_filial?: string | null;
    situacao_cadastral?: string | null;
    data_inicio_atividade?: string | null;
    cnae_fiscal_principal?: string | null;
    cnae_principal_descricao?: string | null;
    cnaes_fiscais_secundarios?: string | null;
    tipo_logradouro?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cep?: string | null;
    uf?: string | null;
    municipio_descricao?: string | null;
    site_url?: string | null;
    site_final_url?: string | null;
    site_ativo?: boolean | null;
    plataforma?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    digital_score?: number | null;
    digital_maturity?: string | null;
    presence_score?: number | null;
    commerce_score?: number | null;
    fit_score?: number | null;
    pain_score?: number | null;
    presence_maturity?: string | null;
    commerce_maturity?: string | null;
    lead_classification?: string | null;
    decisor_nome?: string | null;
    decisor_qualificacao?: string | null;
    faixa_faturamento_estimada?: string | null;
    capital_social?: number | string | null;
    opcao_mei?: string | null;
    opcao_simples?: string | null;
    qualification_status?: string | null;
    qualification_reasons?: string[] | null;
    rejection_reasons?: string[] | null;
    contact_channel?: string | null;
    contact_value?: string | null;
    contact_confidence?: number | null;
    qualification_version?: string | null;
    qualified_at?: string | null;
    last_qualified_at?: string | null;
    profile_quality?: string | null;
    capacity_score?: number | null;
    intent_score?: number | null;
    decision_makers_count?: number | null;
    signals_count?: number | null;
    sources_success?: string[] | null;
    sources_pending?: string[] | null;
    intelligence_summary?: string | null;
    intelligence_reasons?: string[] | null;
    intent_last_seen_at?: string | null;
    commercial_temperature?: string | null;
    last_commercial_event_at?: string | null;
    feedback_events_count?: number | null;
    deliverability_status?: string | null;
    email_risk_score?: number | null;
    mx_valid?: boolean | null;
    email_disposable?: boolean | null;
    email_reason_codes?: string[] | null;
    group_key?: string | null;
    group_primary?: boolean | null;
    created_at: string;
    updated_at: string;
  };
  case?: CrmCase | null;
  messages: {
    id: number;
    campaign: string;
    channel: string;
    subject?: string | null;
    status: string;
    updated_at: string;
  }[];
  history: {
    id: number;
    event_type: string;
    from_stage?: string | null;
    to_stage?: string | null;
    note?: string | null;
    created_at: string;
  }[];
  people: {
    id: number;
    full_name: string;
    role_title?: string | null;
    relationship_type: string;
    linkedin_url?: string | null;
    business_email?: string | null;
    business_phone?: string | null;
    is_decision_maker: boolean;
    confidence: number;
    source_code: string;
    source_url?: string | null;
    priority_score: number;
  }[];
  signals: {
    id: number;
    source_code: string;
    signal_type: string;
    category: string;
    title: string;
    description?: string | null;
    score: number;
    confidence: number;
    observed_at: string;
    source_url?: string | null;
  }[];
  technologies: {
    technology: string;
    category: string;
    confidence: number;
    source_code: string;
    source_url?: string | null;
  }[];
  sources: {
    source_code: string;
    display_name?: string | null;
    status: string;
    records_found: number;
    last_checked_at?: string | null;
    last_error?: string | null;
  }[];
};
type QueueItem = {
  id: number;
  campaign_id: number;
  company: string;
  campaign: string;
  campaign_status: string;
  template_name?: string | null;
  destination: string;
  subject?: string | null;
  scheduled_at?: string | null;
  sent_at?: string | null;
  status: string;
  provider?: string | null;
  last_error?: string | null;
  score: number;
  lead_quality: string;
};
type QueueCampaign = {
  id: number;
  name: string;
  status: string;
  template_name?: string | null;
  audience_mode: 'all' | 'quality' | 'score';
  audience_qualities: string[];
  min_score?: number | null;
  max_score?: number | null;
  daily_limit: number;
  scheduled_start_at?: string | null;
  launched_at?: string | null;
  total: number;
  queued: number;
  sending: number;
  sent: number;
  delivered: number;
  failed: number;
  replied: number;
};
type QueueLog = {
  id: number;
  time: string;
  level: string;
  message: string;
};
type QueueSnapshot = {
  metrics: {
    queued: number;
    processed_today: number;
    accepted_today: number;
    failed_today: number;
  };
  campaigns: QueueCampaign[];
  items: QueueItem[];
  logs: QueueLog[];
};
type OperationalSettings = {
  provider: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  require_approval: boolean;
  daily_limit: number;
  hourly_limit: number;
  domain_daily_limit: number;
  send_interval_seconds: number;
  send_start_hour: number;
  send_end_hour: number;
  timezone: string;
  dry_run: boolean;
};
type InjectorConfig = {
  source: string;
  base_url: string;
  competence: string;
  cnaes: string;
  ufs: string;
  active_only: boolean;
  include_secondary_cnae: boolean;
  require_nome_fantasia: boolean;
  require_telefone: boolean;
  require_email: boolean;
  block_backoffice_email: boolean;
  min_activity_months: number;
  min_population: number;
  exclude_mei: boolean;
  min_confidence_score: number;
  min_lead_score: number;
  load_batch_size: number;
  force_etl: boolean;
  continuous: boolean;
  force_enrich: boolean;
  enrich_batch_size: number;
  intelligence_sources: string;
  intelligence_batch_size: number;
};
type InjectorRun = {
  id: number;
  status: string;
  conclusion?: string | null;
  event: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  head_sha: string;
};
type InjectorSnapshot = {
  run: {
    id: number;
    status: string;
    conclusion?: string | null;
    created_at: string;
    updated_at: string;
    html_url: string;
  };
  progress: number;
  current_step: string;
  steps: {
    number?: number;
    name: string;
    status: string;
    conclusion?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
  }[];
  logs: string[];
  etl_run?: {
    id: number;
    competence: string;
    status: string;
    started_at?: string | null;
    finished_at?: string | null;
    files_total: number;
    files_processed: number;
    rows_processed: number;
    error?: string | null;
    cancel_requested_at?: string | null;
  } | null;
  files: {
    name: string;
    type: string;
    status: string;
    rows: number;
    bytes?: number | null;
    downloaded_at?: string | null;
    processed_at?: string | null;
    error?: string | null;
    downloaded_bytes?: number;
    scanned_rows?: number;
    skipped_rows?: number;
    activity_at?: string | null;
  }[];
  storage: {
    database_bytes: number;
    limit_bytes?: number | null;
    schemas: Record<string, number>;
  };
  counts: {
    companies: number;
    enriched: number;
    qualified: number;
    rejected: number;
    rejected_below_score: number;
    rejected_pre_enrichment: number;
  };
  intelligence?: {
    profiles: number;
    completed_checks: number;
    failed_checks: number;
    running_checks: number;
    core_processed_checks: number;
    core_total_checks: number;
    current_source?: string | null;
    latest_source?: string | null;
    sources: {
      source: string;
      completed: number;
      failed: number;
      running: number;
      total: number;
    }[];
  };
  enrichment?: {
    id: number;
    status: string;
    started_at: string;
    finished_at?: string | null;
    processed: number;
    done: number;
    partial: number;
    no_site: number;
    failed: number;
    activity_at: string;
  } | null;
  activity?: {
    phase: string;
    label: string;
    current?: number | null;
    total?: number | null;
    updated_at?: string | null;
  } | null;
  warning?: string;
};

const nav: { id: View; label: string; icon: typeof Gauge }[] = [
  { id: 'overview', label: 'Visão geral', icon: Gauge },
  { id: 'campaigns', label: 'Campanhas', icon: Send },
  { id: 'templates', label: 'Modelos', icon: FileText },
  { id: 'contacts', label: 'Contatos', icon: Users },
  { id: 'crm', label: 'CRM', icon: Columns3 },
  { id: 'smart-search', label: 'Busca Inteligente', icon: Sparkles },
  { id: 'commercial-priority', label: 'Prioridade Comercial', icon: Flame },
  { id: 'queue', label: 'Fila de envio', icon: Activity },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'injector', label: 'Injector', icon: Database },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const emptyQueue: QueueSnapshot = {
  metrics: {
    queued: 0,
    processed_today: 0,
    accepted_today: 0,
    failed_today: 0,
  },
  campaigns: [],
  items: [],
  logs: [],
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  const data = (await response.json().catch(() => ({}))) as T & {
    detail?: string;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(
      data.detail || data.error || `${url}: HTTP ${response.status}`,
    );
  }
  return data;
}

export function MestreLeadDashboard({ userName }: { userName: string }) {
  const [view, setView] = useState<View>('overview');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [queue, setQueue] = useState<QueueSnapshot>(emptyQueue);
  const [settings, setSettings] = useState<OperationalSettings | null>(null);
  const [injectorConfig, setInjectorConfig] = useState<InjectorConfig | null>(
    null,
  );
  const [injectorRuns, setInjectorRuns] = useState<InjectorRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [preview, setPreview] = useState<Template | null>(null);
  const [paused, setPaused] = useState(false);
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchJson<{ templates: Template[] }>('/api/templates'),
      fetchJson<{ campaigns: Campaign[] }>('/api/campaigns'),
      fetchJson<QueueSnapshot>('/api/queue'),
      fetchJson<{ settings: OperationalSettings }>('/api/settings'),
      fetchJson<{ config: InjectorConfig }>('/api/injector/config'),
      fetchJson<{ runs: InjectorRun[] }>('/api/injector/runs'),
    ]);
    const errors: string[] = [];
    const apply = <T,>(index: number, update: (value: T) => void) => {
      const result = results[index];
      if (result.status === 'fulfilled') update(result.value as T);
      else
        errors.push(
          result.reason instanceof Error
            ? result.reason.message
            : 'Falha de conexão',
        );
    };
    apply<{ templates: Template[] }>(0, (data) => setTemplates(data.templates));
    apply<{ campaigns: Campaign[] }>(1, (data) => setCampaigns(data.campaigns));
    apply<QueueSnapshot>(2, setQueue);
    apply<{ settings: OperationalSettings }>(3, (data) =>
      setSettings(data.settings),
    );
    apply<{ config: InjectorConfig }>(4, (data) =>
      setInjectorConfig(data.config),
    );
    apply<{ runs: InjectorRun[] }>(5, (data) => setInjectorRuns(data.runs));
    setDataError([...new Set(errors)].join(' • '));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    const context =
      typeof document === 'undefined' ? undefined : document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: 'start_campaign_creation',
          title: 'Criar campanha',
          description:
            'Abre o formulário visível para configurar uma nova campanha no MestreLead.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute() {
            setView('campaigns');
            setCampaignOpen(true);
            return { opened: true };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    void Promise.resolve(
      context.registerTool(
        {
          name: 'open_delivery_settings',
          title: 'Abrir configurações de envio',
          description:
            'Navega para os limites, janela de envio e proteções do MestreLead.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute() {
            setView('settings');
            return { view: 'settings' };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const title = nav.find((item) => item.id === view)?.label ?? 'Visão geral';

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden min-h-screen flex-col border-r border-white/8 bg-[#09172a] text-white lg:flex">
        <Brand />
        <Nav view={view} setView={setView} />
        <User userName={userName} />
      </aside>
      <main className="min-w-0">
        <header className="flex min-h-20 items-center justify-between border-b bg-white px-5 md:px-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Operação de e-mail
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <Button
            size="lg"
            className="h-11 bg-[#5b5cf0] px-4 hover:bg-[#4d4ed9]"
            onClick={() => setCampaignOpen(true)}
          >
            <Plus /> Nova campanha
          </Button>
        </header>
        <div className="border-b bg-white px-4 py-2 lg:hidden">
          <select
            aria-label="Navegação"
            value={view}
            onChange={(event) => setView(event.target.value as View)}
            className="h-10 w-full rounded-lg border bg-white px-3"
          >
            {nav.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {notice && (
          <div className="mx-5 mt-5 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:mx-8">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} aria-label="Fechar aviso">
              <XCircle className="size-4" />
            </button>
          </div>
        )}
        {dataError && (
          <div className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 md:mx-8">
            <strong>Dados de produção indisponíveis.</strong> {dataError}
          </div>
        )}
        {loading && (
          <div className="mx-5 mt-5 rounded-lg border bg-white px-4 py-3 text-sm text-muted-foreground md:mx-8">
            Carregando dados dos serviços de produção…
          </div>
        )}
        <div className="p-5 md:p-8">
          {view === 'overview' && (
            <Overview
              campaigns={campaigns}
              queue={queue}
              settings={settings}
              setView={setView}
              paused={paused}
            />
          )}
          {view === 'campaigns' && (
            <Campaigns
              campaigns={campaigns}
              openCreate={() => setCampaignOpen(true)}
            />
          )}
          {view === 'templates' &&
            (templateOpen ? (
              <TemplateEditorPage
                key={editingTemplate?.id ?? 'new'}
                template={editingTemplate}
                onCancel={() => setTemplateOpen(false)}
                onPreview={setPreview}
                onSaved={(item) => {
                  setTemplates((current) => [
                    item,
                    ...current.filter(
                      (row) => row.id !== item.id && row.id > 0,
                    ),
                  ]);
                  setTemplateOpen(false);
                  setNotice('Modelo salvo com sucesso.');
                }}
              />
            ) : (
              <Templates
                templates={templates}
                openCreate={() => {
                  setEditingTemplate(null);
                  setTemplateOpen(true);
                }}
                setPreview={setPreview}
                editTemplate={(template) => {
                  setEditingTemplate(template);
                  setTemplateOpen(true);
                }}
              />
            ))}
          {view === 'contacts' && <Contacts />}
          {view === 'crm' && <Crm setNotice={setNotice} />}
          {view === 'smart-search' && (
            <IntentEngine mode="search" setNotice={setNotice} />
          )}
          {view === 'commercial-priority' && (
            <IntentEngine mode="priority" setNotice={setNotice} />
          )}
          {view === 'queue' && (
            <Queue
              paused={paused}
              setPaused={setPaused}
              setNotice={setNotice}
              snapshot={queue}
              settings={settings}
              templates={templates}
              refresh={refresh}
            />
          )}
          {view === 'reports' && <Reports campaigns={campaigns} />}
          {view === 'injector' && (
            <Injector
              key={injectorConfig ? 'ready' : 'loading'}
              config={injectorConfig}
              runs={injectorRuns}
              setNotice={setNotice}
              refresh={refresh}
            />
          )}
          {view === 'settings' && (
            <DeliverySettings settings={settings} setNotice={setNotice} />
          )}
        </div>
      </main>
      <CampaignDialog
        open={campaignOpen}
        setOpen={setCampaignOpen}
        templates={templates}
        onSaved={(item) => {
          setCampaigns((current) => [
            item,
            ...current.filter((row) => row.id > 0),
          ]);
          setView('campaigns');
          setNotice('Campanha criada como rascunho.');
        }}
      />
      <PreviewDialog template={preview} close={() => setPreview(null)} />
    </div>
  );
}

function Brand() {
  return (
    <div className="border-b border-white/10 px-6 py-6">
      <div className="text-xl font-extrabold tracking-tight">
        Mestre<span className="text-[#8d8eff]">Lead</span>
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Outreach Control
      </div>
    </div>
  );
}

function Nav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <nav
      className="flex-1 space-y-1 px-3 py-6"
      aria-label="Navegação principal"
    >
      {nav.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setView(item.id)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${view === item.id ? 'bg-[#6567f1] text-white shadow-lg shadow-indigo-950/30' : 'text-slate-300 hover:bg-white/7 hover:text-white'}`}
        >
          <item.icon className="size-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function User({ userName }: { userName: string }) {
  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="grid size-9 place-items-center rounded-full bg-[#8d8eff] text-sm font-bold text-[#09172a]">
          PT
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {userName}
          </span>
          <span className="block text-xs text-slate-400">Administrador</span>
        </span>
      </div>
    </div>
  );
}

function Overview({
  campaigns,
  queue,
  settings,
  setView,
  paused,
}: {
  campaigns: Campaign[];
  queue: QueueSnapshot;
  settings: OperationalSettings | null;
  setView: (view: View) => void;
  paused: boolean;
}) {
  const totals = sumCampaignMetrics(campaigns);
  return (
    <div className="space-y-7">
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Indicadores"
      >
        <Metric
          label="Enviados hoje"
          value={String(totals.sent)}
          detail="registrados nas campanhas"
          icon={Send}
        />
        <Metric
          label="Na fila"
          value={String(queue.metrics.queued)}
          detail="mensagens aguardando processamento"
          icon={Mail}
        />
        <Metric
          label="Taxa de entrega"
          value={rate(totals.delivered, totals.sent)}
          detail="sobre os envios registrados"
          icon={ShieldCheck}
          positive
        />
        <Metric
          label="Respostas"
          value={String(totals.replied)}
          detail={`${rate(totals.replied, totals.delivered)} dos entregues`}
          icon={Users}
          positive
        />
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <CampaignTable
          campaigns={campaigns.slice(0, 3)}
          action={() => setView('campaigns')}
        />
        <Card className="border-0 bg-[#0d2038] text-white shadow-sm ring-0">
          <CardHeader>
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#8d8eff]/20 text-[#aeb0ff]">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="text-lg font-bold text-white">
              {paused ? 'Envios pausados' : 'Envio protegido'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-slate-300">
              A cadência gradual e os limites por domínio ajudam a proteger a
              reputação.
            </p>
            <div className="space-y-3">
              <ControlRow
                label="Limite diário"
                value={String(settings?.daily_limit ?? '—')}
              />
              <ControlRow
                label="Limite por hora"
                value={String(settings?.hourly_limit ?? '—')}
              />
              <ControlRow
                label="Intervalo"
                value={
                  settings
                    ? `${Math.round(settings.send_interval_seconds / 60)} min`
                    : '—'
                }
              />
            </div>
            <Button
              variant="secondary"
              className="w-full bg-white text-[#0d2038]"
              onClick={() => setView('settings')}
            >
              Revisar configurações
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Campaigns({
  campaigns,
  openCreate,
}: {
  campaigns: Campaign[];
  openCreate: () => void;
}) {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Campanhas"
        description="Crie, revise e acompanhe cada fluxo de contato."
        action="Criar campanha"
        onAction={openCreate}
      />
      <CampaignTable campaigns={campaigns} />
    </div>
  );
}

function CampaignTable({
  campaigns,
  action,
}: {
  campaigns: Campaign[];
  action?: () => void;
}) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
      <CardHeader className="flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-lg font-bold">
            Campanhas recentes
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Preparação, aprovação e envio em um só lugar.
          </p>
        </div>
        {action && (
          <Button variant="ghost" onClick={action}>
            Ver todas <ChevronRight />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Campanha</TableHead>
              <TableHead>Assunto apresentado</TableHead>
              <TableHead>Público</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Enviados</TableHead>
              <TableHead className="text-right">Aberturas</TableHead>
              <TableHead className="text-right">Cliques</TableHead>
              <TableHead className="pr-5 text-right">Respostas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!campaigns.length && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma campanha retornada pelo outreach.
                </TableCell>
              </TableRow>
            )}
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="h-16">
                <TableCell className="pl-5 font-semibold">
                  {campaign.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.subject ?? '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.audience}
                </TableCell>
                <TableCell>
                  <StatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-right font-mono">
                  {campaign.sent_count ?? 0}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {rate(campaign.opened_count, campaign.delivered_count)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {rate(campaign.clicked_count, campaign.delivered_count)}
                </TableCell>
                <TableCell className="pr-5 text-right font-mono">
                  {rate(campaign.replied_count, campaign.delivered_count)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Templates({
  templates,
  openCreate,
  setPreview,
  editTemplate,
}: {
  templates: Template[];
  openCreate: () => void;
  setPreview: (template: Template) => void;
  editTemplate: (template: Template) => void;
}) {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Modelos de e-mail"
        description="Crie, edite, visualize e compare o desempenho de cada mensagem."
        action="Novo modelo"
        onAction={openCreate}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!templates.length && (
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nenhum modelo retornado pelo outreach.
            </CardContent>
          </Card>
        )}
        {templates.map((template) => (
          <Card
            key={template.id}
            className="border-0 shadow-sm ring-1 ring-slate-200/80"
          >
            <CardHeader>
              <div className="mb-3 flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="size-5" />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editTemplate(template)}
                  aria-label={`Editar ${template.name}`}
                >
                  <MoreHorizontal />
                </Button>
              </div>
              <CardTitle className="font-bold">{template.name}</CardTitle>
              <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                {template.subject}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                <TemplateMetric
                  label="Aberturas"
                  value={rate(template.opened_count, template.sent_count)}
                />
                <TemplateMetric
                  label="Cliques"
                  value={rate(template.clicked_count, template.sent_count)}
                />
                <TemplateMetric
                  label="Respostas"
                  value={rate(template.replied_count, template.sent_count)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPreview(template)}
                >
                  <Eye /> Prévia
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => editTemplate(template)}
                >
                  <FileText /> Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const emptyContactPage: ContactPage = {
  contacts: [],
  metrics: {
    total: 0,
    quality_a: 0,
    quality_b: 0,
    with_whatsapp: 0,
    public_profile: 0,
    average_score: 0,
  },
  pagination: { page: 1, page_size: 25, total: 0, total_pages: 1 },
};

function useContactPage(page: number, query: string) {
  const [data, setData] = useState<ContactPage>(emptyContactPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          page_size: '25',
        });
        if (query.trim()) params.set('q', query.trim());
        fetch(`/api/contacts?${params}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
          .then(async (response) => {
            const body = (await response.json()) as ContactPage & {
              error?: string;
              detail?: string;
            };
            if (!response.ok)
              throw new Error(
                body.error || body.detail || 'Falha ao carregar contatos',
              );
            setData(body);
            setError('');
          })
          .catch((reason) => {
            if (reason instanceof DOMException && reason.name === 'AbortError')
              return;
            setError(
              reason instanceof Error
                ? reason.message
                : 'Falha ao carregar contatos',
            );
          })
          .finally(() => setLoading(false));
      },
      query ? 350 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [page, query]);
  return { data, loading, error };
}

function Contacts() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error } = useContactPage(page, query);
  return (
    <div className="space-y-5">
      <PageIntro
        title="Contatos"
        description="Leads sincronizados e prontos para segmentação."
        action="Importar contatos"
      />
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        aria-label="Resumo dos leads"
      >
        <Metric
          label="Leads com e-mail"
          value={formatCount(data.metrics.total)}
          detail="qualificados e sincronizados"
          icon={Users}
        />
        <Metric
          label="Qualidade A"
          value={formatCount(data.metrics.quality_a)}
          detail="enriquecido: score ≥ 70 + sinal forte"
          icon={ShieldCheck}
          positive
        />
        <Metric
          label="Qualidade B"
          value={formatCount(data.metrics.quality_b)}
          detail="pré-qualificado ou sem sinal forte"
          icon={Activity}
        />
        <Metric
          label="Com WhatsApp"
          value={formatCount(data.metrics.with_whatsapp)}
          detail="canal disponível na origem"
          icon={Send}
        />
        <Metric
          label="Perfil público"
          value={formatCount(data.metrics.public_profile)}
          detail={`score médio ${Number(data.metrics.average_score || 0).toLocaleString('pt-BR')}`}
          icon={Gauge}
        />
      </section>
      <Card className="border-indigo-100 bg-indigo-50/60 shadow-none">
        <CardContent className="grid gap-2 p-4 text-sm lg:grid-cols-3">
          <p>
            <strong>Score 0–100:</strong> começa como pré-score cadastral e é
            substituído pelo score digital após o enriquecimento. Abaixo de 70
            é descartado.
          </p>
          <p>
            <strong>Qualidade A:</strong> e-mail válido, confiança e score
            mínimos de 70, mais site, WhatsApp ou Google operacional confirmado.
          </p>
          <p>
            <strong>Qualidade B:</strong> passou na triagem e no e-mail, mas
            ainda aguarda aprofundamento ou não apresentou sinal forte para A.
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 pl-9"
              placeholder="Buscar empresa ou e-mail"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Empresa</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Qualidade</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Último assunto apresentado</TableHead>
                <TableHead className="text-right">Aberturas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data.contacts.length && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {loading
                      ? 'Carregando contatos…'
                      : 'Nenhum contato encontrado.'}
                  </TableCell>
                </TableRow>
              )}
              {data.contacts.map((contact) => (
                <TableRow key={contact.id} className="h-15">
                  <TableCell className="pl-5 font-semibold">
                    {contact.company}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    {contact.whatsapp ? (
                      <a
                        className="font-medium text-emerald-700 hover:underline"
                        href={contact.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir conversa
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <QualityBadge quality={contact.lead_quality} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="font-mono font-semibold">
                      {contact.score}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      público {contact.profile_score}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[340px] truncate text-muted-foreground">
                    {contact.last_subject ?? '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {contact.opens}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {contactStatus(contact.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">
            {formatCount(data.pagination.total)} resultados · página{' '}
            {data.pagination.page} de {data.pagination.total_pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => value - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.total_pages || loading}
              onClick={() => setPage((value) => value + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

const crmStages: { id: CrmStage; label: string }[] = [
  { id: 'ready', label: 'Novo' },
  { id: 'contacted', label: 'Em contato' },
  { id: 'replied', label: 'Respondeu' },
  { id: 'qualified', label: 'Qualificado' },
  { id: 'meeting', label: 'Reunião' },
  { id: 'proposal', label: 'Proposta' },
  { id: 'won', label: 'Ganho' },
  { id: 'lost', label: 'Perdido' },
];
const crmServiceTypes: { id: CrmServiceType; label: string }[] = [
  { id: 'prospecting', label: 'Prospecção' },
  { id: 'qualification', label: 'Qualificação' },
  { id: 'demo', label: 'Demonstração' },
  { id: 'proposal', label: 'Proposta' },
  { id: 'negotiation', label: 'Negociação' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'reactivation', label: 'Reativação' },
  { id: 'after_sales', label: 'Pós-venda' },
];

function Crm({ setNotice }: { setNotice: (notice: string) => void }) {
  const [mode, setMode] = useState<'leads' | 'kanban'>('leads');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading } = useContactPage(page, query);
  const [cases, setCases] = useState<CrmCase[]>([]);
  const [selected, setSelected] = useState<LeadDetail | null>(null);
  const [starting, setStarting] = useState<Contact | null>(null);
  const [serviceType, setServiceType] = useState<CrmServiceType>('prospecting');

  async function loadCases() {
    const response = await fetchJson<{ cases: CrmCase[] }>('/api/crm');
    setCases(response.cases);
  }
  useEffect(() => {
    void fetchJson<{ cases: CrmCase[] }>('/api/crm')
      .then((response) => setCases(response.cases))
      .catch(() => setNotice('Não foi possível carregar o Kanban do CRM.'));
  }, [setNotice]);

  async function openLead(id: number) {
    try {
      setSelected(await fetchJson<LeadDetail>(`/api/crm/leads/${id}`));
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Falha ao abrir o lead.',
      );
    }
  }

  async function startCase() {
    if (!starting) return;
    try {
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: starting.id,
          service_type: serviceType,
        }),
      });
      if (!response.ok)
        throw new Error('Não foi possível iniciar o atendimento.');
      await loadCases();
      setStarting(null);
      setMode('kanban');
      setNotice('Lead colocado em atendimento.');
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Falha ao iniciar atendimento.',
      );
    }
  }

  async function moveCase(item: CrmCase, stage: CrmStage) {
    const response = await fetch(`/api/crm/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    if (!response.ok) {
      setNotice('Não foi possível mover o atendimento.');
      return;
    }
    setCases((current) =>
      current.map((row) => (row.id === item.id ? { ...row, stage } : row)),
    );
  }

  return (
    <div className="space-y-5">
      <PageIntro
        title="CRM"
        description="Selecione leads, consulte o perfil completo e acompanhe cada atendimento."
      />
      <div className="flex gap-2">
        <Button
          variant={mode === 'leads' ? 'default' : 'outline'}
          onClick={() => setMode('leads')}
        >
          <Users /> Lista de leads
        </Button>
        <Button
          variant={mode === 'kanban' ? 'default' : 'outline'}
          onClick={() => setMode('kanban')}
        >
          <Columns3 /> Kanban <Badge variant="secondary">{cases.length}</Badge>
        </Button>
      </div>
      {mode === 'leads' ? (
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
          <CardHeader className="border-b">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar empresa, e-mail ou CNPJ"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Qualidade</TableHead>
                  <TableHead>Score do lead</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data.contacts.length && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {loading
                        ? 'Carregando leads…'
                        : 'Nenhum lead encontrado.'}
                    </TableCell>
                  </TableRow>
                )}
                {data.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="pl-5 font-semibold">
                      {contact.company}
                    </TableCell>
                    <TableCell>
                      <p>{contact.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.phone || 'Telefone não informado'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <QualityBadge quality={contact.lead_quality} />
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {contact.score}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void openLead(contact.id)}
                        >
                          <Eye /> Detalhes
                        </Button>
                        <Button size="sm" onClick={() => setStarting(contact)}>
                          Colocar em atendimento
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
            <span className="text-muted-foreground">
              {formatCount(data.pagination.total)} leads · página{' '}
              {data.pagination.page} de {data.pagination.total_pages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= data.pagination.total_pages}
                onClick={() => setPage((value) => value + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[1840px] grid-cols-8 gap-3">
            {crmStages.map((stage) => {
              const items = cases.filter((item) => item.stage === stage.id);
              return (
                <section
                  key={stage.id}
                  className="min-h-[420px] rounded-xl bg-slate-100 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{stage.label}</h3>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Card key={item.id} className="gap-3 p-3 shadow-sm">
                        <button
                          className="text-left font-semibold hover:text-indigo-600"
                          onClick={() => void openLead(item.lead_id)}
                        >
                          {item.company}
                        </button>
                        <div className="text-xs text-muted-foreground">
                          <p>{serviceTypeLabel(item.service_type)}</p>
                          <p>{item.email}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <QualityBadge quality={item.lead_quality} />
                          <span className="font-mono text-xs">
                            {item.score}
                          </span>
                        </div>
                        <select
                          aria-label="Mover atendimento"
                          className="h-8 w-full rounded-md border bg-white px-2 text-xs"
                          value={item.stage}
                          onChange={(event) =>
                            void moveCase(item, event.target.value as CrmStage)
                          }
                        >
                          {crmStages.map((target) => (
                            <option key={target.id} value={target.id}>
                              {target.label}
                            </option>
                          ))}
                        </select>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
      <Dialog
        open={Boolean(starting)}
        onOpenChange={(open) => !open && setStarting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Colocar em atendimento</DialogTitle>
            <DialogDescription>{starting?.company}</DialogDescription>
          </DialogHeader>
          <label className="space-y-2 text-sm font-medium">
            Tipo de atendimento
            <select
              className="h-10 w-full rounded-md border bg-white px-3 font-normal"
              value={serviceType}
              onChange={(event) =>
                setServiceType(event.target.value as CrmServiceType)
              }
            >
              {crmServiceTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStarting(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void startCase()}>
              Iniciar atendimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LeadDetailDialog detail={selected} close={() => setSelected(null)} />
    </div>
  );
}

function LeadDetailDialog({
  detail,
  close,
}: {
  detail: LeadDetail | null;
  close: () => void;
}) {
  const lead = detail?.lead;
  const people = detail?.people ?? [];
  const signals = detail?.signals ?? [];
  const technologies = detail?.technologies ?? [];
  const sources = detail?.sources ?? [];
  const address = lead
    ? [
        lead.tipo_logradouro,
        lead.logradouro,
        lead.numero,
        lead.complemento,
        lead.bairro,
        lead.cep && `CEP ${lead.cep}`,
      ]
        .filter(Boolean)
        .join(', ')
    : '';
  return (
    <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{lead?.company}</DialogTitle>
          <DialogDescription>
            Perfil cadastral, inteligência comercial, decisores e histórico de
            atendimento.
          </DialogDescription>
        </DialogHeader>
        {detail && lead && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
              <DetailStat label="Qualidade" value={lead.lead_quality || '—'} />
              <DetailStat
                label="Score do lead"
                value={String(lead.score ?? 0)}
              />
              <DetailStat
                label="Perfil público"
                value={String(lead.profile_score ?? 0)}
              />
              <DetailStat
                label="Confiança dos dados"
                value={`${lead.data_confidence_score ?? 0}/10`}
              />
              <DetailStat
                label="Intenção"
                value={String(lead.intent_score ?? 0)}
              />
              <DetailStat
                label="Capacidade"
                value={String(lead.capacity_score ?? 0)}
              />
            </div>
            {lead.intelligence_summary && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Resumo comercial
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {lead.intelligence_summary}
                </p>
              </div>
            )}

            <DetailSection title="Empresa e cadastro">
              <DetailGrid
                fields={[
                  { label: 'CNPJ', value: formatCnpj(lead.cnpj) },
                  { label: 'Razão social', value: lead.company_name },
                  { label: 'Nome fantasia', value: lead.trade_name },
                  {
                    label: 'Situação',
                    value:
                      lead.situacao_cadastral === '02'
                        ? 'Ativa'
                        : lead.situacao_cadastral,
                  },
                  {
                    label: 'Matriz/filial',
                    value:
                      lead.identificador_matriz_filial === '1'
                        ? 'Matriz'
                        : lead.identificador_matriz_filial === '2'
                          ? 'Filial'
                          : null,
                  },
                  {
                    label: 'Início da atividade',
                    value: formatDate(lead.data_inicio_atividade),
                  },
                  {
                    label: 'Natureza jurídica',
                    value: lead.natureza_juridica_descricao,
                  },
                  {
                    label: 'Porte cadastral',
                    value: companySizeLabel(lead.porte),
                  },
                  {
                    label: 'Capital social',
                    value: formatCurrency(lead.capital_social),
                  },
                  {
                    label: 'Simples Nacional',
                    value: yesNoCode(lead.opcao_simples),
                  },
                  { label: 'MEI', value: yesNoCode(lead.opcao_mei) },
                  {
                    label: 'Município/UF',
                    value: [lead.municipio_descricao, lead.uf]
                      .filter(Boolean)
                      .join(' / '),
                  },
                  {
                    label: 'CNAE principal',
                    value: [
                      lead.cnae_fiscal_principal,
                      lead.cnae_principal_descricao,
                    ]
                      .filter(Boolean)
                      .join(' — '),
                  },
                  { label: 'Endereço', value: address, wide: true },
                ]}
              />
            </DetailSection>

            <DetailSection title="Contato e presença digital">
              <DetailGrid
                fields={[
                  {
                    label: 'E-mail',
                    value: lead.email,
                    href: lead.email ? `mailto:${lead.email}` : undefined,
                  },
                  {
                    label: 'Entregabilidade',
                    value: deliverabilityLabel(
                      lead.deliverability_status,
                      lead.email_risk_score,
                    ),
                  },
                  { label: 'Telefone', value: lead.phone },
                  {
                    label: 'WhatsApp',
                    value: lead.whatsapp ? 'Abrir conversa' : null,
                    href: lead.whatsapp || undefined,
                  },
                  {
                    label: 'Site',
                    value: lead.site_final_url || lead.site_url,
                    href: lead.site_final_url || lead.site_url || undefined,
                  },
                  { label: 'Plataforma', value: lead.plataforma },
                  {
                    label: 'Instagram',
                    value: lead.instagram_url ? 'Abrir perfil' : null,
                    href: lead.instagram_url || undefined,
                  },
                  {
                    label: 'LinkedIn',
                    value: lead.linkedin_url ? 'Abrir perfil' : null,
                    href: lead.linkedin_url || undefined,
                  },
                  { label: 'Canal recomendado', value: lead.contact_channel },
                  { label: 'Função do contato', value: lead.contact_role },
                  {
                    label: 'Confiança do contato',
                    value:
                      lead.contact_confidence == null
                        ? null
                        : `${lead.contact_confidence}%`,
                  },
                  {
                    label: 'Maturidade digital',
                    value: lead.digital_maturity || lead.presence_maturity,
                  },
                ]}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <DetailStat
                  label="Presença"
                  value={String(lead.presence_score ?? 0)}
                />
                <DetailStat
                  label="Comércio"
                  value={String(lead.commerce_score ?? 0)}
                />
                <DetailStat label="Fit" value={String(lead.fit_score ?? 0)} />
                <DetailStat
                  label="Dor/oportunidade"
                  value={String(lead.pain_score ?? 0)}
                />
              </div>
            </DetailSection>

            <DetailSection title="Qualificação e capacidade comercial">
              <DetailGrid
                fields={[
                  { label: 'Classificação', value: lead.lead_classification },
                  {
                    label: 'Faixa estimada',
                    value: lead.faixa_faturamento_estimada,
                  },
                  {
                    label: 'Temperatura comercial',
                    value: lead.commercial_temperature,
                  },
                  {
                    label: 'Decisores encontrados',
                    value: lead.decision_makers_count,
                  },
                  { label: 'Sinais encontrados', value: lead.signals_count },
                  {
                    label: 'Último sinal de intenção',
                    value: formatDateTime(lead.intent_last_seen_at),
                  },
                  {
                    label: 'Qualificado em',
                    value: formatDateTime(lead.qualified_at),
                  },
                  {
                    label: 'Última revisão',
                    value: formatDateTime(lead.last_qualified_at),
                  },
                ]}
              />
              <TagList
                title="Motivos da qualificação"
                items={lead.qualification_reasons}
              />
              <TagList
                title="Evidências do perfil"
                items={lead.intelligence_reasons}
              />
            </DetailSection>

            <DetailSection title={`Pessoas e decisores (${people.length})`}>
              {!people.length ? (
                <EmptyDetail text="Nenhuma pessoa pública encontrada para esta empresa." />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {people.map((person) => (
                    <div key={person.id} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{person.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {person.role_title ||
                              relationshipLabel(person.relationship_type)}
                          </p>
                        </div>
                        {person.is_decision_maker && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            Decisor
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Prioridade {person.priority_score} · confiança{' '}
                        {person.confidence}% ·{' '}
                        {intelligenceSourceLabel(person.source_code)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {person.business_email && (
                          <a
                            className="text-indigo-600 hover:underline"
                            href={`mailto:${person.business_email}`}
                          >
                            {person.business_email}
                          </a>
                        )}
                        {person.business_phone && (
                          <span>{person.business_phone}</span>
                        )}
                        {person.linkedin_url && (
                          <a
                            className="text-indigo-600 hover:underline"
                            href={person.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DetailSection>

            <DetailSection title={`Sinais de inteligência (${signals.length})`}>
              {!signals.length ? (
                <EmptyDetail text="Nenhum sinal comercial público registrado." />
              ) : (
                <div className="space-y-2">
                  {signals.map((signal) => (
                    <div
                      key={signal.id}
                      className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{signal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {signal.description ||
                            `${signal.signal_type} · ${intelligenceSourceLabel(signal.source_code)}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Badge variant="secondary">{signal.category}</Badge>
                        <Badge
                          className={
                            signal.score > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : signal.score < 0
                                ? 'bg-rose-100 text-rose-700'
                                : ''
                          }
                          variant="secondary"
                        >
                          {signal.score > 0 ? '+' : ''}
                          {signal.score}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DetailSection>

            <DetailSection title="Tecnologias identificadas">
              {!technologies.length ? (
                <EmptyDetail text="Nenhuma tecnologia identificada." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((item) => (
                    <Badge
                      key={`${item.technology}-${item.source_code}`}
                      variant="secondary"
                    >
                      {item.technology} · {item.confidence}%
                    </Badge>
                  ))}
                </div>
              )}
            </DetailSection>

            <DetailSection title="Cobertura das fontes">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sources.map((source) => (
                  <div
                    key={source.source_code}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span>
                      {source.display_name ||
                        intelligenceSourceLabel(source.source_code)}
                    </span>
                    <Badge
                      className={
                        source.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : source.status === 'failed'
                            ? 'bg-rose-100 text-rose-700'
                            : ''
                      }
                      variant="secondary"
                    >
                      {sourceStatusLabel(source.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Atendimento e histórico">
              <p className="text-sm text-muted-foreground">
                {detail.case
                  ? `${serviceTypeLabel(detail.case.service_type)} · ${crmStageLabel(detail.case.stage)}`
                  : 'Este lead ainda não foi colocado em atendimento.'}
              </p>
              <div className="mt-4 space-y-2">
                {!detail.messages.length && (
                  <EmptyDetail text="Nenhuma mensagem registrada." />
                )}
                {detail.messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <p className="font-medium">
                      {message.subject || message.campaign}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {message.channel} · {contactStatus(message.status)} ·{' '}
                      {formatDateTime(message.updated_at)}
                    </p>
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

type DetailField = {
  label: string;
  value: unknown;
  href?: string;
  wide?: boolean;
};

function DetailGrid({ fields }: { fields: DetailField[] }) {
  return (
    <div className="grid gap-x-6 gap-y-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div
          key={field.label}
          className={field.wide ? 'sm:col-span-2 lg:col-span-3' : ''}
        >
          <p className="text-xs font-medium text-muted-foreground">
            {field.label}
          </p>
          {field.href && field.value ? (
            <a
              className="mt-1 block break-words text-sm font-medium text-indigo-600 hover:underline"
              href={field.href}
              target={field.href.startsWith('http') ? '_blank' : undefined}
              rel={field.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {displayDetailValue(field.value)}
            </a>
          ) : (
            <p className="mt-1 break-words text-sm font-medium">
              {displayDetailValue(field.value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TagList({ title, items }: { title: string; items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary">
            {humanizeCode(item)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function EmptyDetail({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-slate-50 p-3 text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold">{value}</p>
    </div>
  );
}

function displayDetailValue(value: unknown) {
  if (value === null || value === undefined || value === '')
    return 'Não informado';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  return JSON.stringify(value);
}

function formatCnpj(value?: string | null) {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length !== 14) return value || 'Não informado';
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('pt-BR');
}

function formatCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return null;
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function companySizeLabel(value?: string | null) {
  const labels: Record<string, string> = {
    '00': 'Não informado',
    '01': 'Microempresa',
    '03': 'Empresa de pequeno porte',
    '05': 'Demais portes',
  };
  return labels[value || ''] || value;
}

function yesNoCode(value?: string | null) {
  if (value === 'S') return 'Sim';
  if (value === 'N') return 'Não';
  return null;
}

function deliverabilityLabel(status?: string | null, risk?: number | null) {
  if (!status) return null;
  const labels: Record<string, string> = {
    valid: 'Válido',
    risky: 'Com risco',
    invalid: 'Inválido',
    unknown: 'Não confirmado',
  };
  return `${labels[status] || status}${risk == null ? '' : ` · risco ${risk}`}`;
}

function relationshipLabel(value: string) {
  const labels: Record<string, string> = {
    partner: 'Sócio',
    administrator: 'Administrador',
    founder: 'Fundador',
    executive: 'Executivo',
    employee: 'Colaborador',
    contact: 'Contato',
  };
  return labels[value] || humanizeCode(value);
}

function sourceStatusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    running: 'Consultando',
    success: 'Concluída',
    no_data: 'Sem dados',
    failed: 'Falhou',
    skipped: 'Adiada',
  };
  return labels[value] || humanizeCode(value);
}

function humanizeCode(value: string) {
  return value
    .replaceAll('_', ' ')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function QualityBadge({ quality }: { quality?: string | null }) {
  return (
    <Badge
      className={
        quality === 'A'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-blue-100 text-blue-700'
      }
      variant="secondary"
    >
      Qualidade {quality || 'B'}
    </Badge>
  );
}

function serviceTypeLabel(value: CrmServiceType) {
  return crmServiceTypes.find((item) => item.id === value)?.label ?? value;
}

function crmStageLabel(value: CrmStage) {
  return crmStages.find((item) => item.id === value)?.label ?? value;
}

function Queue({
  paused,
  setPaused,
  setNotice,
  snapshot,
  settings,
  templates,
  refresh,
}: {
  paused: boolean;
  setPaused: (paused: boolean) => void;
  setNotice: (notice: string) => void;
  snapshot: QueueSnapshot;
  settings: OperationalSettings | null;
  templates: Template[];
  refresh: () => Promise<void>;
}) {
  const [testEmail, setTestEmail] = useState('');
  const [testCompany, setTestCompany] = useState('Empresa de teste');
  const [testTemplateId, setTestTemplateId] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignTemplateId, setCampaignTemplateId] = useState('');
  const [audienceMode, setAudienceMode] = useState<
    'all' | 'quality' | 'score'
  >('quality');
  const [qualityA, setQualityA] = useState(true);
  const [qualityB, setQualityB] = useState(false);
  const [minScore, setMinScore] = useState('70');
  const [maxScore, setMaxScore] = useState('100');
  const [dailyLimit, setDailyLimit] = useState('30');
  const [scheduledAt, setScheduledAt] = useState('');
  const [audienceEstimate, setAudienceEstimate] = useState<{
    total: number;
    quality_a: number;
    quality_b: number;
    min_score: number;
    max_score: number;
  } | null>(null);
  const [audienceLoading, setAudienceLoading] = useState(false);
  const [campaignStarting, setCampaignStarting] = useState(false);
  const [dispatchingCampaignId, setDispatchingCampaignId] = useState<
    number | null
  >(null);
  const running =
    dispatchingCampaignId !== null ||
    snapshot.items.some((item) => item.status === 'sending');
  const queueCampaigns = snapshot.campaigns ?? [];

  const activeTestTemplateId =
    testTemplateId || (templates[0] ? String(templates[0].id) : '');
  const activeCampaignTemplateId =
    campaignTemplateId || (templates[0] ? String(templates[0].id) : '');

  useEffect(() => {
    if (!dispatchingCampaignId || paused || settings?.dry_run) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const processNext = async () => {
      try {
        const response = await fetch(
          `/api/campaigns/${dispatchingCampaignId}/send-next`,
          { method: 'POST' },
        );
        const data = (await response.json().catch(() => ({}))) as {
          processed?: boolean;
          status?: string | null;
          detail?: string;
          error?: string;
        };
        if (!response.ok)
          throw new Error(data.detail || data.error || 'Falha no envio');
        await refresh();
        if (!data.processed || data.status === 'failed') {
          setDispatchingCampaignId(null);
          setNotice(
            data.status === 'failed'
              ? 'Execução interrompida após falha. Consulte o log.'
              : 'Nenhuma mensagem elegível agora. Limites ou agendamento podem estar ativos.',
          );
          return;
        }
        if (!stopped) {
          timer = setTimeout(
            processNext,
            Math.max(5, settings?.send_interval_seconds ?? 60) * 1000,
          );
        }
      } catch (error) {
        setDispatchingCampaignId(null);
        setNotice(
          error instanceof Error ? error.message : 'Falha ao processar envio.',
        );
      }
    };
    void processNext();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [
    dispatchingCampaignId,
    paused,
    refresh,
    setNotice,
    settings?.dry_run,
    settings?.send_interval_seconds,
  ]);

  const audiencePayload = {
    audience_mode: audienceMode,
    audience_qualities: [
      ...(qualityA ? ['A'] : []),
      ...(qualityB ? ['B'] : []),
    ],
    min_score: audienceMode === 'score' ? Number(minScore || 0) : null,
    max_score: audienceMode === 'score' ? Number(maxScore || 100) : null,
  };

  async function estimateAudience() {
    if (audienceMode === 'quality' && !qualityA && !qualityB) {
      setNotice('Selecione pelo menos a qualidade A ou B.');
      return null;
    }
    setAudienceLoading(true);
    try {
      const response = await fetch('/api/audience/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audiencePayload),
      });
      const data = (await response.json()) as {
        audience?: typeof audienceEstimate;
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.detail || data.error || 'Falha ao calcular público');
      setAudienceEstimate(data.audience ?? null);
      return data.audience ?? null;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Falha ao calcular público.');
      return null;
    } finally {
      setAudienceLoading(false);
    }
  }

  async function sendTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTestSending(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          companyName: testCompany,
          templateId: activeTestTemplateId,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.detail || data.error || 'Falha no teste');
      setNotice(`E-mail de teste enviado para ${testEmail}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Falha no teste.');
    } finally {
      setTestSending(false);
    }
  }

  async function createAndLaunchCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const estimate = audienceEstimate ?? (await estimateAudience());
    if (!estimate?.total) {
      setNotice('Nenhum contato corresponde aos filtros escolhidos.');
      return;
    }
    const template = templates.find(
      (item) => item.id === Number(activeCampaignTemplateId),
    );
    if (!template) return;
    setCampaignStarting(true);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          templateId: activeCampaignTemplateId,
          subject: template.subject,
          textBody: template.text_body,
          htmlBody: template.html_body,
          dailyLimit,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : '',
          audienceMode,
          audienceQualities: audiencePayload.audience_qualities,
          minScore: audiencePayload.min_score,
          maxScore: audiencePayload.max_score,
        }),
      });
      const campaignData = (await response.json().catch(() => ({}))) as {
        campaign?: Campaign;
        detail?: string;
        error?: string;
      };
      if (!response.ok || !campaignData.campaign)
        throw new Error(
          campaignData.detail || campaignData.error || 'Falha ao criar campanha',
        );
      const launch = await fetch(
        `/api/campaigns/${campaignData.campaign.id}/launch`,
        { method: 'POST' },
      );
      const launchData = (await launch.json().catch(() => ({}))) as {
        queued?: number;
        detail?: string;
        error?: string;
      };
      if (!launch.ok)
        throw new Error(
          launchData.detail || launchData.error || 'Falha ao preparar campanha',
        );
      await refresh();
      setNotice(
        `${Number(launchData.queued ?? 0).toLocaleString('pt-BR')} mensagens enfileiradas em ${campaignName}.`,
      );
      if (!settings?.dry_run && !scheduledAt) {
        setPaused(false);
        setDispatchingCampaignId(campaignData.campaign.id);
      }
      setCampaignName('');
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Falha ao iniciar campanha.',
      );
    } finally {
      setCampaignStarting(false);
    }
  }
  const processed = Number(snapshot.metrics.processed_today || 0);
  const success = Number(snapshot.metrics.accepted_today || 0);
  const failed = Number(snapshot.metrics.failed_today || 0);
  const total = processed + Number(snapshot.metrics.queued || 0);
  const progress = total ? Math.round((processed / total) * 100) : 0;
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Central de envio</h2>
            <Badge
              className={
                running && !paused
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }
              variant="secondary"
            >
              <span
                className={`size-1.5 rounded-full bg-current ${running && !paused ? 'animate-pulse' : ''}`}
              />
              {running && !paused
                ? 'Ao vivo'
                : paused
                  ? 'Pausado'
                  : 'Aguardando'}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dispare agora, agende e acompanhe cada mensagem em tempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void refresh()}>
            <Activity /> Atualizar
          </Button>
          {running ? (
            <>
              <Button variant="outline" onClick={() => setPaused(!paused)}>
                {paused ? <Play /> : <Pause />}
                {paused ? 'Retomar' : 'Pausar'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDispatchingCampaignId(null);
                  setPaused(true);
                  setNotice('Execução desta tela interrompida. A fila foi preservada.');
                }}
              >
                <Square /> Interromper
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                const campaign = queueCampaigns.find(
                  (item) => item.status === 'active' && item.queued > 0,
                );
                if (!campaign) {
                  setNotice('Nenhuma campanha ativa possui mensagens na fila.');
                  return;
                }
                if (settings?.dry_run) {
                  setNotice(
                    'Envio real bloqueado: desative DRY_RUN no backend antes de iniciar.',
                  );
                  return;
                }
                setPaused(false);
                setDispatchingCampaignId(campaign.id);
              }}
              disabled={!snapshot.items.length}
            >
              <Send /> Enviar agora
            </Button>
          )}
        </div>
      </div>

      {settings?.dry_run && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Modo seguro ativo.</strong> Testes individuais podem ser
          enviados, mas campanhas reais permanecem bloqueadas enquanto
          <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5">
            DRY_RUN=true
          </code>
          no backend.
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.4fr]">
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="size-5 text-indigo-600" /> Testar um modelo
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Envie somente para o endereço informado antes de criar uma
              campanha.
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <form className="grid gap-4" onSubmit={sendTest}>
              <Field label="Modelo">
                <select
                  value={activeTestTemplateId}
                  onChange={(event) => setTestTemplateId(event.target.value)}
                  className="h-10 w-full rounded-lg border bg-white px-3"
                  required
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Enviar teste para">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  placeholder="seuemail@empresa.com.br"
                  required
                />
              </Field>
              <Field label="Empresa usada na personalização">
                <Input
                  value={testCompany}
                  onChange={(event) => setTestCompany(event.target.value)}
                  required
                />
              </Field>
              <Button type="submit" disabled={testSending || !templates.length}>
                <Send /> {testSending ? 'Enviando teste…' : 'Enviar e-mail de teste'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5 text-indigo-600" /> Configurar público e
              iniciar campanha
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Escolha o modelo e selecione todos, qualidade A/B ou uma faixa de
              score.
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <form className="grid gap-4" onSubmit={createAndLaunchCampaign}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome da campanha">
                  <Input
                    value={campaignName}
                    onChange={(event) => setCampaignName(event.target.value)}
                    placeholder="Ex.: História da planilha — leads A"
                    required
                  />
                </Field>
                <Field label="Modelo">
                  <select
                    value={activeCampaignTemplateId}
                    onChange={(event) =>
                      setCampaignTemplateId(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border bg-white px-3"
                    required
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Selecionar contatos">
                <select
                  value={audienceMode}
                  onChange={(event) => {
                    setAudienceMode(
                      event.target.value as 'all' | 'quality' | 'score',
                    );
                    setAudienceEstimate(null);
                  }}
                  className="h-10 w-full rounded-lg border bg-white px-3"
                >
                  <option value="quality">Por qualidade A ou B</option>
                  <option value="score">Por faixa de score</option>
                  <option value="all">Todos os contatos elegíveis</option>
                </select>
              </Field>
              {audienceMode === 'quality' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    htmlFor="audience-quality-a"
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                  >
                    <input
                      id="audience-quality-a"
                      type="checkbox"
                      checked={qualityA}
                      onChange={(event) => {
                        setQualityA(event.target.checked);
                        setAudienceEstimate(null);
                      }}
                    />
                    <span>
                      <strong>Qualidade A</strong>
                      <span className="block text-xs text-muted-foreground">
                        Maior confiança e sinal comercial
                      </span>
                    </span>
                  </label>
                  <label
                    htmlFor="audience-quality-b"
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                  >
                    <input
                      id="audience-quality-b"
                      type="checkbox"
                      checked={qualityB}
                      onChange={(event) => {
                        setQualityB(event.target.checked);
                        setAudienceEstimate(null);
                      }}
                    />
                    <span>
                      <strong>Qualidade B</strong>
                      <span className="block text-xs text-muted-foreground">
                        Elegível, mas com menos sinais
                      </span>
                    </span>
                  </label>
                </div>
              )}
              {audienceMode === 'score' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Score mínimo">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={minScore}
                      onChange={(event) => {
                        setMinScore(event.target.value);
                        setAudienceEstimate(null);
                      }}
                    />
                  </Field>
                  <Field label="Score máximo">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={maxScore}
                      onChange={(event) => {
                        setMaxScore(event.target.value);
                        setAudienceEstimate(null);
                      }}
                    />
                  </Field>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Limite diário">
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={dailyLimit}
                    onChange={(event) => setDailyLimit(event.target.value)}
                  />
                </Field>
                <Field label="Agendar início (opcional)">
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                  />
                </Field>
              </div>
              {audienceEstimate && (
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-indigo-50 p-4 text-center">
                  <div>
                    <strong className="block text-xl">
                      {formatCount(audienceEstimate.total)}
                    </strong>
                    <span className="text-xs text-muted-foreground">total</span>
                  </div>
                  <div>
                    <strong className="block text-xl text-emerald-700">
                      {formatCount(audienceEstimate.quality_a)}
                    </strong>
                    <span className="text-xs text-muted-foreground">A</span>
                  </div>
                  <div>
                    <strong className="block text-xl text-blue-700">
                      {formatCount(audienceEstimate.quality_b)}
                    </strong>
                    <span className="text-xs text-muted-foreground">B</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void estimateAudience()}
                  disabled={audienceLoading}
                >
                  <Gauge />
                  {audienceLoading ? 'Calculando…' : 'Calcular público'}
                </Button>
                <Button
                  type="submit"
                  disabled={campaignStarting || !templates.length}
                >
                  <Play />
                  {campaignStarting ? 'Preparando…' : 'Criar e iniciar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Andamento em tempo real"
      >
        <Metric
          label="Processados"
          value={`${processed}/${total}`}
          detail={`${progress}% concluído`}
          icon={Activity}
        />
        <Metric
          label="Entregues ao provedor"
          value={String(success)}
          detail="aceitos pela SendPulse"
          icon={CheckCircle2}
          positive
        />
        <Metric
          label="Falhas"
          value={String(failed)}
          detail="sem novas tentativas"
          icon={XCircle}
        />
        <Metric
          label="Velocidade"
          value={settings ? `${settings.hourly_limit}/h` : '—'}
          detail="cadência protegida"
          icon={Clock3}
        />
      </section>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <CardTitle className="font-bold">Campanhas em acompanhamento</CardTitle>
          <p className="text-sm text-muted-foreground">
            Público, modelo, quantidade, progresso e controles de cada execução.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 pt-5 lg:grid-cols-2">
          {!queueCampaigns.length && (
            <p className="py-6 text-center text-sm text-muted-foreground lg:col-span-2">
              Nenhuma campanha configurada.
            </p>
          )}
          {queueCampaigns.map((campaign) => {
            const campaignProgress = campaign.total
              ? Math.round(
                  ((campaign.sent + campaign.failed) / campaign.total) * 100,
                )
              : 0;
            return (
              <div key={campaign.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{campaign.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {campaign.template_name || 'Modelo não informado'} ·{' '}
                      {campaign.audience_mode === 'quality'
                        ? `qualidade ${campaign.audience_qualities.join('/')}`
                        : campaign.audience_mode === 'score'
                          ? `score ${campaign.min_score ?? 0}–${campaign.max_score ?? 100}`
                          : 'todos os elegíveis'}
                    </p>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${campaignProgress}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <strong className="block text-base">{campaign.total}</strong>
                    total
                  </div>
                  <div>
                    <strong className="block text-base text-indigo-700">
                      {campaign.queued}
                    </strong>
                    fila
                  </div>
                  <div>
                    <strong className="block text-base text-emerald-700">
                      {campaign.sent}
                    </strong>
                    enviados
                  </div>
                  <div>
                    <strong className="block text-base text-rose-700">
                      {campaign.failed}
                    </strong>
                    falhas
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {campaign.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await fetch(`/api/campaigns/${campaign.id}/pause`, {
                          method: 'POST',
                        });
                        if (dispatchingCampaignId === campaign.id)
                          setDispatchingCampaignId(null);
                        await refresh();
                      }}
                    >
                      <Pause /> Pausar
                    </Button>
                  ) : campaign.status === 'paused' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await fetch(`/api/campaigns/${campaign.id}/resume`, {
                          method: 'POST',
                        });
                        await refresh();
                      }}
                    >
                      <Play /> Retomar
                    </Button>
                  ) : null}
                  {campaign.status === 'active' && campaign.queued > 0 && (
                    <Button
                      size="sm"
                      disabled={
                        settings?.dry_run || dispatchingCampaignId === campaign.id
                      }
                      onClick={() => {
                        setPaused(false);
                        setDispatchingCampaignId(campaign.id);
                      }}
                    >
                      <Send />
                      {dispatchingCampaignId === campaign.id
                        ? 'Enviando…'
                        : 'Enviar agora'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-bold">Mensagens por destinatário</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {settings
                  ? `Próximo envio respeita intervalo de ${Math.round(settings.send_interval_seconds / 60)} minutos.`
                  : 'Aguardando configuração do outreach.'}
              </p>
            </div>
            <span className="font-mono text-lg font-bold">{progress}%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#5b5cf0] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {!snapshot.items.length && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Nenhuma mensagem preparada ou enviada pelo outreach.
            </div>
          )}
          {snapshot.items.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 px-5 py-4 md:grid-cols-[44px_1.1fr_1.15fr_120px_130px] md:items-center"
            >
              <span className="grid size-9 place-items-center rounded-full bg-slate-100 font-mono text-sm">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-semibold">{item.company}</p>
                <p className="text-sm text-muted-foreground">
                  {item.destination}
                </p>
              </div>
              <div>
                <p className="truncate text-sm font-medium">{item.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {item.campaign} · qualidade {item.lead_quality} · score{' '}
                  {item.score}
                </p>
              </div>
              <Badge
                className={index === 0 ? 'bg-indigo-50 text-indigo-700' : ''}
                variant="secondary"
              >
                <Clock3 /> {queueStatus(item.status)}
              </Badge>
              <div className="text-right text-xs text-muted-foreground">
                <span className="block">
                  {item.sent_at
                    ? `Enviado ${formatDateTime(item.sent_at)}`
                    : `Previsto ${formatDateTime(item.scheduled_at)}`}
                </span>
                <span className="block">{item.provider || item.template_name || '—'}</span>
                {item.last_error && (
                  <span className="block truncate text-rose-600">
                    {item.last_error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-[#071424] text-slate-200 shadow-sm ring-0">
        <CardHeader className="flex-row items-center justify-between border-b border-white/10">
          <div>
            <CardTitle className="font-mono text-base font-bold text-white">
              Log em tempo real
            </CardTitle>
            <p className="mt-1 text-xs text-slate-400">
              Eventos desta execução, mais recentes primeiro.
            </p>
          </div>
          <Badge
            className="bg-emerald-400/10 text-emerald-300"
            variant="secondary"
          >
            conectado
          </Badge>
        </CardHeader>
        <CardContent className="space-y-1 py-3 font-mono text-xs">
          {!snapshot.logs.length && (
            <div className="px-2 py-5 text-center text-slate-500">
              Nenhum evento registrado pelo outreach.
            </div>
          )}
          {snapshot.logs.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="grid grid-cols-[76px_76px_1fr] gap-3 rounded px-2 py-2 hover:bg-white/5"
            >
              <span className="text-slate-500">{formatTime(log.time)}</span>
              <span
                className={
                  log.level === 'success'
                    ? 'text-emerald-400'
                    : 'text-indigo-300'
                }
              >
                {log.level.toUpperCase()}
              </span>
              <span>{log.message}</span>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}

function Reports({ campaigns }: { campaigns: Campaign[] }) {
  const totals = sumCampaignMetrics(campaigns);
  return (
    <div className="space-y-5">
      <PageIntro
        title="Relatórios"
        description="Resultado agregado dos últimos 30 dias."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Entregues"
          value={String(totals.delivered)}
          detail={`${rate(totals.delivered, totals.sent)} dos envios`}
          icon={CheckCircle2}
          positive
        />
        <Metric
          label="Falhas"
          value={String(totals.bounced)}
          detail={`${rate(totals.bounced, totals.sent)} dos envios`}
          icon={XCircle}
        />
        <Metric
          label="Respostas"
          value={String(totals.replied)}
          detail={`${rate(totals.replied, totals.delivered)} dos entregues`}
          icon={Mail}
          positive
        />
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader>
          <CardTitle>Saúde da operação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <Health
            label="Taxa de entrega"
            value={rate(totals.delivered, totals.sent)}
            width={percentWidth(totals.delivered, totals.sent)}
          />
          <Health
            label="Taxa de abertura"
            value={rate(totals.opened, totals.delivered)}
            width={percentWidth(totals.opened, totals.delivered)}
          />
          <Health
            label="Taxa de resposta"
            value={rate(totals.replied, totals.delivered)}
            width={percentWidth(totals.replied, totals.delivered)}
          />
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <CardTitle>Eficiência por assunto</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare o texto apresentado com a reação dos destinatários.
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Assunto</TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead className="text-right">Enviados</TableHead>
                <TableHead className="text-right">Aberturas</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="pr-5 text-right">Respostas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="h-15">
                  <TableCell className="max-w-[320px] truncate pl-5 font-semibold">
                    {campaign.subject ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campaign.name}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {campaign.sent_count ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {rate(campaign.opened_count, campaign.delivered_count)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {rate(campaign.clicked_count, campaign.delivered_count)}
                  </TableCell>
                  <TableCell className="pr-5 text-right font-mono">
                    {rate(campaign.replied_count, campaign.delivered_count)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Injector({
  config,
  runs,
  setNotice,
  refresh,
}: {
  config: InjectorConfig | null;
  runs: InjectorRun[];
  setNotice: (notice: string) => void;
  refresh: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<InjectorConfig | null>(config);
  const [starting, setStarting] = useState(false);
  const [snapshot, setSnapshot] = useState<InjectorSnapshot | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [monitorError, setMonitorError] = useState('');
  const [abortOpen, setAbortOpen] = useState(false);
  const [cleanupOpen, setCleanupOpen] = useState(false);
  const [aborting, setAborting] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const logViewportRef = useRef<HTMLDivElement | null>(null);

  const liveRun = runs.find((run) => run.status !== 'completed');
  const monitoredRun =
    runs.find((run) => run.id === selectedRunId) ?? liveRun ?? runs[0];
  const monitoredRunId = monitoredRun?.id;
  const monitoredRunStatus = monitoredRun?.status;
  const logCount = snapshot?.logs.length ?? 0;
  const latestLogTail = snapshot?.logs.slice(-8).join('\n') ?? '';

  useEffect(() => {
    if (!monitoredRunId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchJson<InjectorSnapshot>(
          `/api/injector/runs/${monitoredRunId}`,
        );
        if (!cancelled) {
          setSnapshot(data);
          setMonitorError('');
        }
      } catch (error) {
        if (!cancelled)
          setMonitorError(
            error instanceof Error
              ? error.message
              : 'Falha ao atualizar o andamento.',
          );
      }
    };
    void load();
    const timer =
      monitoredRunStatus === 'completed'
        ? undefined
        : window.setInterval(() => void load(), 3000);
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [monitoredRunId, monitoredRunStatus]);

  useEffect(() => {
    const viewport = logViewportRef.current;
    if (!viewport) return;
    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [latestLogTail, logCount, monitoredRunId]);

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setStarting(true);
    try {
      const response = await fetch('/api/injector/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        detail?: string;
      };
      if (!response.ok)
        throw new Error(result.detail || 'Falha ao iniciar o Injector.');
      setNotice(
        result.message ||
          'Injector iniciado. A execução aparecerá abaixo em instantes.',
      );
      setSelectedRunId(null);
      window.setTimeout(() => void refresh(), 3000);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Falha ao iniciar o Injector.',
      );
    } finally {
      setStarting(false);
    }
  }

  async function abortRun() {
    if (!snapshot || snapshot.run.status === 'completed') return;
    setAborting(true);
    try {
      const response = await fetch(
        `/api/injector/runs/${snapshot.run.id}/cancel`,
        { method: 'POST' },
      );
      const result = (await response.json().catch(() => ({}))) as {
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          result.detail || result.error || 'Falha ao abortar a carga.',
        );
      setNotice(
        'Cancelamento solicitado. O processo encerrará de forma segura em instantes.',
      );
      setAbortOpen(false);
      await refresh();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Falha ao abortar a carga.',
      );
    } finally {
      setAborting(false);
    }
  }

  async function pauseRun() {
    if (!snapshot || snapshot.run.status === 'completed') return;
    setPausing(true);
    try {
      const response = await fetch(
        `/api/injector/runs/${snapshot.run.id}/pause`,
        { method: 'POST' },
      );
      const result = (await response.json().catch(() => ({}))) as {
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(result.detail || result.error || 'Falha ao pausar.');
      setNotice(
        'Pausa solicitada. O cursor foi preservado; Iniciar Injector retoma do ponto salvo.',
      );
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Falha ao pausar.');
    } finally {
      setPausing(false);
    }
  }

  async function publishQualified() {
    setPublishing(true);
    try {
      const response = await fetch('/api/injector/publish-qualified', {
        method: 'POST',
      });
      const result = (await response.json().catch(() => ({}))) as {
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          result.detail || result.error || 'Falha ao publicar qualificados.',
        );
      setNotice(
        'Publicação iniciada em paralelo. A carga principal continuará normalmente.',
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Falha ao publicar qualificados.',
      );
    } finally {
      setPublishing(false);
    }
  }

  async function cleanupStorage() {
    setCleaning(true);
    try {
      const response = await fetch('/api/injector/cleanup-storage', {
        method: 'POST',
      });
      const result = (await response.json().catch(() => ({}))) as {
        detail?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          result.detail || result.error || 'Falha ao iniciar a limpeza.',
        );
      setNotice(
        'Limpeza iniciada. Ela remove apenas intermediários e preserva leads, contatos e cursores.',
      );
      setCleanupOpen(false);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Falha ao iniciar a limpeza.',
      );
    } finally {
      setCleaning(false);
    }
  }

  if (!draft) {
    return (
      <div className="space-y-5">
        <PageIntro
          title="Injector de prospects"
          description="Configuração e execução do prospect-etl-inejctor."
        />
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            O serviço do Injector não retornou a configuração de produção.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={start} className="space-y-5">
      <PageIntro
        title="Injector de prospects"
        description="Configure a carga e acompanhe processamento, logs e armazenamento em tempo quase real."
      />
      {snapshot && (
        <div className="space-y-5">
          <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader className="border-b bg-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Acompanhamento da carga</CardTitle>
                    <Badge variant="secondary">
                      {workflowStatus(snapshot.run.status)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {snapshot.intelligence?.current_source
                      ? `Consultando ${intelligenceSourceLabel(snapshot.intelligence.current_source)}`
                      : snapshot.current_step}{' '}
                    · atualização automática a cada 3 segundos
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void publishQualified()}
                    disabled={publishing}
                  >
                    {publishing ? <Activity className="animate-spin" /> : <Save />}
                    {publishing ? 'Publicando…' : 'Publicar qualificados'}
                  </Button>
                  {snapshot.run.status !== 'completed' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void pauseRun()}
                      disabled={pausing}
                    >
                      {pausing ? <Activity className="animate-spin" /> : <Pause />}
                      {pausing ? 'Pausando…' : 'Pausar carga'}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCleanupOpen(true)}
                    disabled={cleaning || snapshot.run.status !== 'completed'}
                    title={
                      snapshot.run.status !== 'completed'
                        ? 'Pause a carga antes de compactar o banco'
                        : undefined
                    }
                  >
                    {cleaning ? <Activity className="animate-spin" /> : <Database />}
                    {cleaning ? 'Limpando…' : 'Liberar armazenamento'}
                  </Button>
                  {snapshot.run.status !== 'completed' && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setAbortOpen(true)}
                    >
                      <Square className="size-4 fill-current" />
                      Abortar carga
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso geral</span>
                  <span className="font-mono font-bold">
                    {snapshot.progress}%
                  </span>
                </div>
                <ProgressBar value={snapshot.progress} />
              </div>

              {snapshot.activity && (
                <div className="flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="relative mt-1 flex size-2.5 shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-60" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-violet-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">
                        Atividade atual
                      </p>
                      <p className="mt-0.5 break-words text-sm font-semibold text-slate-950">
                        {snapshot.activity.label}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    {!!snapshot.activity.total && (
                      <p className="font-mono text-sm font-bold text-violet-800">
                        {formatCount(snapshot.activity.current ?? 0)}/
                        {formatCount(snapshot.activity.total)} ·{' '}
                        {percentage(
                          snapshot.activity.current,
                          snapshot.activity.total,
                        )}
                        %
                      </p>
                    )}
                    <p className="text-xs text-violet-700">
                      {activityAge(snapshot.activity.updated_at)}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <RuntimeMetric
                  label="Empresas armazenadas"
                  value={formatCount(snapshot.counts.companies)}
                  detail="cadastros na base"
                />
                <RuntimeMetric
                  label="Linhas nesta carga"
                  value={formatCount(snapshot.etl_run?.rows_processed ?? 0)}
                  detail="processadas até agora"
                />
                <RuntimeMetric
                  label="Leads enriquecidos"
                  value={formatCount(snapshot.counts.enriched)}
                  detail={`${formatCount(snapshot.counts.qualified)} qualificados · ${formatCount(snapshot.counts.rejected_pre_enrichment)} pré-filtrados · ${formatCount(snapshot.counts.rejected_below_score)} após análise`}
                />
                <RuntimeMetric
                  label="Consultas de inteligência"
                  value={formatCount(
                    snapshot.intelligence?.completed_checks ?? 0,
                  )}
                  detail={
                    snapshot.intelligence?.current_source
                      ? `agora: ${intelligenceSourceLabel(snapshot.intelligence.current_source)}`
                      : `${formatCount(snapshot.intelligence?.profiles ?? 0)} perfis analisados`
                  }
                />
                <RuntimeMetric
                  label="Banco utilizado"
                  value={formatBytes(snapshot.storage.database_bytes)}
                  detail={
                    snapshot.storage.limit_bytes
                      ? `de ${formatBytes(snapshot.storage.limit_bytes)}`
                      : 'limite não informado'
                  }
                />
              </div>

              {!!snapshot.intelligence?.sources.length && (
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">Fontes de inteligência</p>
                      <p className="text-xs text-muted-foreground">
                        Avanço real das consultas públicas e licenciadas
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatCount(snapshot.intelligence.core_processed_checks)}
                      /{formatCount(snapshot.intelligence.core_total_checks)}{' '}
                      consultas essenciais
                    </span>
                  </div>
                  <ProgressBar
                    value={percentage(
                      snapshot.intelligence.core_processed_checks,
                      snapshot.intelligence.core_total_checks,
                    )}
                    compact
                  />
                  <p className="mt-2 text-right text-[11px] text-muted-foreground">
                    {formatCount(snapshot.intelligence.profiles)} perfis ·{' '}
                    {formatCount(snapshot.intelligence.failed_checks)} falhas
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {snapshot.intelligence.sources.map((source) => (
                      <div
                        key={source.source}
                        className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"
                      >
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="truncate font-medium">
                            {intelligenceSourceLabel(source.source)}
                          </span>
                          <span className="font-mono font-semibold">
                            {formatCount(source.completed)}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {source.running
                            ? `${formatCount(source.running)} em processamento`
                            : `${formatCount(source.total)} verificações`}
                          {source.failed
                            ? ` · ${formatCount(source.failed)} falhas`
                            : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="space-y-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Arquivos da Receita</p>
                      <p className="text-xs text-muted-foreground">
                        Download e importação do lote atual
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold">
                      {snapshot.etl_run?.files_processed ?? 0}/
                      {snapshot.etl_run?.files_total ?? 0}
                    </span>
                  </div>
                  <ProgressBar
                    value={percentage(
                      snapshot.etl_run?.files_processed,
                      snapshot.etl_run?.files_total,
                    )}
                  />
                  <div className="max-h-52 space-y-2 overflow-auto pr-1">
                    {!snapshot.files.length && (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        Aguardando o primeiro arquivo da carga.
                      </p>
                    )}
                    {snapshot.files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-slate-200"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{file.name}</p>
                          <p className="text-muted-foreground">
                            {file.status === 'downloading'
                              ? `${formatBytes(file.downloaded_bytes ?? 0)} de ${formatBytes(file.bytes ?? 0)} baixados`
                              : file.status === 'processing'
                                ? `${formatCount(file.scanned_rows ?? 0)} lidas · ${formatCount(file.rows)} elegíveis · ${formatCount(file.skipped_rows ?? 0)} ignoradas`
                                : `${formatCount(file.rows)} linhas${file.bytes ? ` · ${formatBytes(file.bytes)}` : ''}`}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {fileStatus(file.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div>
                    <p className="font-semibold">Armazenamento por área</p>
                    <p className="text-xs text-muted-foreground">
                      Espaço real ocupado pelas tabelas do projeto
                    </p>
                  </div>
                  {snapshot.storage.limit_bytes && (
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span>Uso do limite configurado</span>
                        <span className="font-mono font-semibold">
                          {percentage(
                            snapshot.storage.database_bytes,
                            snapshot.storage.limit_bytes,
                          )}
                          %
                        </span>
                      </div>
                      <ProgressBar
                        value={percentage(
                          snapshot.storage.database_bytes,
                          snapshot.storage.limit_bytes,
                        )}
                        warning
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    {Object.entries(snapshot.storage.schemas).map(
                      ([schema, bytes]) => (
                        <div key={schema}>
                          <div className="mb-1.5 flex justify-between text-xs">
                            <span>{schemaLabel(schema)}</span>
                            <span className="font-mono font-semibold">
                              {formatBytes(bytes)}
                            </span>
                          </div>
                          <ProgressBar
                            value={percentage(
                              bytes,
                              snapshot.storage.database_bytes,
                            )}
                            compact
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
                <div className="rounded-xl border bg-white p-4">
                  <p className="mb-3 font-semibold">Etapas</p>
                  <div className="space-y-2">
                    {snapshot.steps.map((step) => (
                      <div
                        key={`${step.number}-${step.name}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        {step.status === 'completed' ? (
                          step.conclusion === 'success' ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : (
                            <XCircle className="size-4 text-rose-600" />
                          )
                        ) : step.status === 'in_progress' ? (
                          <Activity className="size-4 animate-pulse text-violet-600" />
                        ) : (
                          <Clock3 className="size-4 text-slate-400" />
                        )}
                        <span
                          className={
                            step.status === 'in_progress'
                              ? 'font-semibold text-slate-950'
                              : 'text-slate-600'
                          }
                        >
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl bg-[#071424] text-white">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div>
                      <p className="font-semibold">Log em tempo real</p>
                      <p className="text-xs text-slate-400">
                        Etapas, arquivos, linhas, qualidade e armazenamento
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                      </span>
                      {snapshot.activity?.updated_at
                        ? activityAge(snapshot.activity.updated_at, true)
                        : 'Atualização ativa'}
                    </div>
                  </div>
                  <div
                    ref={logViewportRef}
                    role="log"
                    aria-live="polite"
                    aria-label="Log da execução do Injector"
                    className="h-[26rem] scroll-smooth overflow-auto p-3 font-mono text-[11px] leading-5 text-slate-300"
                  >
                    {!snapshot.logs.length && (
                      <p className="p-2 text-slate-500">
                        Aguardando mensagens do processamento…
                      </p>
                    )}
                    {snapshot.logs.map((line, index) => (
                      <div
                        key={`${index}-${line.slice(0, 24)}`}
                        className={`grid grid-cols-[2.25rem_1fr] gap-2 border-l-2 px-2 py-0.5 ${runtimeLogClassName(line)}`}
                      >
                        <span className="select-none text-right text-slate-600">
                          {String(index + 1).padStart(3, '0')}
                        </span>
                        <p className="whitespace-pre-wrap break-words">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {monitorError && (
                <p className="text-sm text-amber-700">{monitorError}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <SettingsCard title="Origem e recorte da extração">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fonte de dados">
              <Input value={draft.source} readOnly />
            </Field>
            <Field label="Endereço da fonte">
              <Input value={draft.base_url} readOnly />
            </Field>
            <Field label="Competência (AAAA-MM)">
              <Input
                value={draft.competence}
                placeholder="Vazio para usar a mais recente"
                pattern="[0-9]{4}-(0[1-9]|1[0-2])"
                onChange={(event) =>
                  setDraft({ ...draft, competence: event.target.value })
                }
              />
            </Field>
            <Field label="População mínima da cidade">
              <Input
                type="number"
                min="0"
                value={draft.min_population}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    min_population: Number(event.target.value),
                  })
                }
              />
            </Field>
          </div>
          <Field label="CNAEs (opcional — vazio inclui todos)">
            <Textarea
              value={draft.cnaes}
              placeholder="Todos os CNAEs"
              onChange={(event) =>
                setDraft({ ...draft, cnaes: event.target.value })
              }
            />
          </Field>
          <Field label="Estados (UFs separados por vírgula)">
            <Input
              value={draft.ufs}
              placeholder="SP, MG, PR"
              onChange={(event) =>
                setDraft({ ...draft, ufs: event.target.value.toUpperCase() })
              }
            />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle
              label="Somente empresas ativas"
              description="Ignora cadastros com situação inativa."
              checked={draft.active_only}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, active_only: checked })
              }
            />
            <Toggle
              label="Considerar CNAE secundário"
              description="Amplia a busca além do CNAE principal."
              checked={draft.include_secondary_cnae}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, include_secondary_cnae: checked })
              }
            />
            <Toggle
              label="Exigir nome fantasia"
              description="Mantém apenas empresas com nome comercial."
              checked={draft.require_nome_fantasia}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, require_nome_fantasia: checked })
              }
            />
            <Toggle
              label="Exigir telefone"
              description="Mantém somente registros com telefone."
              checked={draft.require_telefone}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, require_telefone: checked })
              }
            />
          </div>
        </SettingsCard>
        <div className="space-y-5">
          <SettingsCard title="Processamento">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Candidatos por ciclo">
                <Input
                  type="number"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={draft.load_batch_size}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      load_batch_size: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Score mínimo">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={draft.min_lead_score}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      min_lead_score: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Lote de enriquecimento">
                <Input
                  type="number"
                  min="1"
                  max="5000"
                  value={draft.enrich_batch_size}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      enrich_batch_size: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Lote de inteligência">
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  value={draft.intelligence_batch_size}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      intelligence_batch_size: Number(event.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <Toggle
              label="Processamento contínuo"
              description="Ao concluir um lote, inicia automaticamente o próximo até esgotar a fonte ou você abortar."
              checked={draft.continuous}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, continuous: checked })
              }
            />
            <Toggle
              label="Refazer extração"
              description="Necessário para buscar o próximo lote da mesma competência."
              checked={draft.force_etl}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, force_etl: checked })
              }
            />
            <Toggle
              label="Refazer enriquecimento"
              description="Reprocessa os dados derivados dos prospects."
              checked={draft.force_enrich}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, force_enrich: checked })
              }
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={starting}
            >
              {starting ? <Activity className="animate-spin" /> : <Play />}
              {starting ? 'Iniciando…' : 'Iniciar Injector'}
            </Button>
          </SettingsCard>
          <Card className="border-0 bg-[#071424] text-white shadow-sm ring-0">
            <CardContent className="space-y-3 p-5 text-sm">
              <p className="font-semibold">Como funciona</p>
              <p className="text-slate-300">
                O botão inicia o pipeline de produção no GitHub Actions. O
                processamento pesado continua fora do navegador e o andamento
                aparece na lista de execuções.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <CardTitle>Execuções recentes</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="pr-5 text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!runs.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma execução retornada pelo GitHub Actions.
                  </TableCell>
                </TableRow>
              )}
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="pl-5">
                    {formatDateTime(run.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {workflowStatus(run.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{workflowConclusion(run.conclusion)}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRunId(run.id)}
                    >
                      Acompanhar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={abortOpen} onOpenChange={setAbortOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abortar esta carga?</DialogTitle>
            <DialogDescription>
              O processamento será cancelado no GitHub. Os dados já gravados
              permanecem seguros no banco e uma próxima execução poderá
              continuar a carga.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAbortOpen(false)}
              disabled={aborting}
            >
              Continuar executando
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void abortRun()}
              disabled={aborting}
            >
              {aborting ? <Activity className="animate-spin" /> : <Square />}
              {aborting ? 'Abortando…' : 'Sim, abortar carga'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={cleanupOpen} onOpenChange={setCleanupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liberar armazenamento do banco?</DialogTitle>
            <DialogDescription>
              Serão removidos dados intermediários que já receberam decisão e
              históricos operacionais antigos. Leads A/B, contatos mínimos
              descartados e o cursor de retomada serão preservados. Durante a
              compactação, essas tabelas ficam temporariamente bloqueadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCleanupOpen(false)}
              disabled={cleaning}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void cleanupStorage()}
              disabled={cleaning}
            >
              {cleaning ? <Activity className="animate-spin" /> : <Database />}
              {cleaning ? 'Limpando…' : 'Sim, liberar espaço'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

function DeliverySettings({
  settings,
  setNotice,
}: {
  settings: OperationalSettings | null;
  setNotice: (notice: string) => void;
}) {
  const explainReadOnly = () =>
    setNotice(
      'Esses valores são controlados com segurança pelo backend do outreach.',
    );
  return (
    <div className="space-y-5">
      <PageIntro
        title="Configurações de envio"
        description="Valores reais carregados do backend do outreach."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsCard title="Remetente">
          <Field label="Nome">
            <Input value={settings?.from_name ?? ''} readOnly />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={settings?.from_email ?? ''} readOnly />
          </Field>
          <Field label="Responder para">
            <Input type="email" value={settings?.reply_to ?? ''} readOnly />
          </Field>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <ShieldCheck className="mr-2 inline size-4" />
            {settings?.provider || 'Provedor não informado'} selecionado
          </div>
        </SettingsCard>
        <SettingsCard title="Cadência">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Por dia">
              <Input
                type="number"
                value={settings?.daily_limit ?? ''}
                readOnly
              />
            </Field>
            <Field label="Por hora">
              <Input
                type="number"
                value={settings?.hourly_limit ?? ''}
                readOnly
              />
            </Field>
            <Field label="Por domínio/dia">
              <Input
                type="number"
                value={settings?.domain_daily_limit ?? ''}
                readOnly
              />
            </Field>
            <Field label="Intervalo (min)">
              <Input
                type="number"
                value={
                  settings
                    ? Math.round(settings.send_interval_seconds / 60)
                    : ''
                }
                readOnly
              />
            </Field>
            <Field label="Início">
              <Input
                type="number"
                value={settings?.send_start_hour ?? ''}
                readOnly
              />
            </Field>
            <Field label="Fim">
              <Input
                type="number"
                value={settings?.send_end_hour ?? ''}
                readOnly
              />
            </Field>
          </div>
        </SettingsCard>
        <SettingsCard title="Proteções">
          <Toggle
            label="Exigir aprovação"
            description="Mensagens só entram na fila depois de revisão."
            checked={settings?.require_approval ?? false}
            onCheckedChange={explainReadOnly}
          />
          <Toggle
            label="Modo seguro"
            description="Prepara a campanha sem realizar envios."
            checked={settings?.dry_run ?? false}
            onCheckedChange={explainReadOnly}
          />
        </SettingsCard>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={explainReadOnly}
        >
          <ShieldCheck /> Gerenciado pelo backend
        </Button>
      </div>
    </div>
  );
}

function TemplateEditorPage({
  template,
  onCancel,
  onPreview,
  onSaved,
}: {
  template: Template | null;
  onCancel: () => void;
  onPreview: (template: Template) => void;
  onSaved: (item: Template) => void;
}) {
  const [name, setName] = useState(template?.name ?? '');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [preheader, setPreheader] = useState(template?.preheader ?? '');
  const [textBody, setTextBody] = useState(template?.text_body ?? '');
  const [htmlBody, setHtmlBody] = useState(template?.html_body ?? '');
  const [title, setTitle] = useState(
    stripHtmlHeading(template?.html_body ?? ''),
  );
  const [editorTab, setEditorTab] = useState<'content' | 'html' | 'text'>(
    'content',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function draft(): Template {
    return {
      id: template?.id ?? -Date.now(),
      name: name || 'Modelo sem nome',
      subject,
      preheader,
      text_body: textBody,
      html_body: htmlBody || buildSimpleEmail(title || subject, textBody),
      updated_at: template?.updated_at ?? new Date().toISOString(),
      sent_count: template?.sent_count,
      opened_count: template?.opened_count,
      clicked_count: template?.clicked_count,
      replied_count: template?.replied_count,
    };
  }

  function addVariable(variable: string) {
    if (editorTab === 'html') setHtmlBody((value) => `${value}${variable}`);
    else setTextBody((value) => `${value}${variable}`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const finalHtml = htmlBody || buildSimpleEmail(title || subject, textBody);
    try {
      const update = Boolean(template && template.id > 0);
      const response = await fetch(
        update ? `/api/templates/${template?.id}` : '/api/templates',
        {
          method: update ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            subject,
            preheader,
            textBody,
            htmlBody: finalHtml,
          }),
        },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? 'Não foi possível salvar o modelo.');
        return;
      }
      const data = (await response.json()) as { template: Template };
      onSaved(data.template);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCancel}
            aria-label="Voltar para modelos"
          >
            <ArrowLeft />
          </Button>
          <div>
            <p className="text-sm font-semibold text-[#5b5cf0]">
              Modelos de e-mail
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              {template ? 'Editar modelo' : 'Criar modelo'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajuste cada detalhe e salve quando a mensagem estiver pronta.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onPreview(draft())}
          >
            <Eye /> Abrir prévia
          </Button>
          <Button type="submit" size="lg" disabled={saving}>
            <Save /> {saving ? 'Salvando...' : 'Salvar modelo'}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                Apresentação na caixa de entrada
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                O assunto e o preheader são os primeiros elementos vistos pelo
                destinatário.
              </p>
            </CardHeader>
            <CardContent className="grid gap-5 pt-5 lg:grid-cols-2">
              <Field label="Nome interno do modelo">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Ex.: Diagnóstico operacional"
                />
              </Field>
              <Field label="Preheader">
                <Input
                  value={preheader}
                  onChange={(event) => setPreheader(event.target.value)}
                  placeholder="Complemento exibido depois do assunto"
                />
              </Field>
              <div className="lg:col-span-2">
                <Field label="Assunto apresentado ao destinatário">
                  <Input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    required
                    placeholder="Uma ideia para a {empresa}"
                    className="h-12 text-base"
                  />
                </Field>
                <div className="mt-3 rounded-xl border bg-slate-50 px-4 py-3">
                  <p className="truncate font-semibold">
                    {personalize(subject) || 'Seu assunto aparecerá aqui'}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {personalize(preheader) ||
                      'O preheader complementa o assunto na caixa de entrada.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader className="flex-row items-center justify-between gap-4 border-b">
              <div>
                <CardTitle className="text-lg">Conteúdo do e-mail</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edite visualmente ou trabalhe diretamente no HTML.
                </p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1">
                {(['content', 'html', 'text'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEditorTab(tab)}
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${editorTab === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                  >
                    {tab === 'content'
                      ? 'Conteúdo'
                      : tab === 'html'
                        ? 'HTML'
                        : 'Texto puro'}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {editorTab === 'content' && (
                <>
                  <Field label="Título principal">
                    <Input
                      value={title}
                      onChange={(event) => {
                        const value = event.target.value;
                        setTitle(value);
                        setHtmlBody(buildSimpleEmail(value, textBody));
                      }}
                      placeholder="Menos tarefas manuais. Mais espaço para crescer."
                      className="h-12 text-base"
                    />
                  </Field>
                  <Field label="Mensagem">
                    <Textarea
                      value={textBody}
                      onChange={(event) => {
                        const value = event.target.value;
                        setTextBody(value);
                        setHtmlBody(buildSimpleEmail(title || subject, value));
                      }}
                      required
                      className="min-h-[360px] resize-y text-base leading-7"
                      placeholder="Olá, equipe da {empresa}..."
                    />
                  </Field>
                </>
              )}
              {editorTab === 'html' && (
                <Field label="HTML completo">
                  <Textarea
                    value={htmlBody}
                    onChange={(event) => setHtmlBody(event.target.value)}
                    required
                    className="min-h-[500px] resize-y font-mono text-sm leading-6"
                    placeholder='<table role="presentation">...</table>'
                  />
                </Field>
              )}
              {editorTab === 'text' && (
                <Field label="Versão em texto puro">
                  <Textarea
                    value={textBody}
                    onChange={(event) => setTextBody(event.target.value)}
                    required
                    className="min-h-[500px] resize-y font-mono text-base leading-7"
                  />
                </Field>
              )}
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
            <CardHeader>
              <CardTitle className="text-base">Personalização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">
                Insira uma variável no conteúdo ativo. A prévia usa dados de
                exemplo.
              </p>
              <div className="grid gap-2">
                {['{empresa}', '{razao_social}', '{cnpj}'].map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    variant="outline"
                    onClick={() => addVariable(variable)}
                    className="justify-start font-mono"
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[#0d2038] text-white shadow-sm ring-0">
            <CardHeader>
              <CardTitle className="text-base text-white">
                Resultado deste modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ControlRow
                label="Enviados"
                value={String(template?.sent_count ?? 0)}
              />
              <ControlRow
                label="Aberturas"
                value={rate(template?.opened_count, template?.sent_count)}
              />
              <ControlRow
                label="Cliques"
                value={rate(template?.clicked_count, template?.sent_count)}
              />
              <ControlRow
                label="Respostas"
                value={rate(template?.replied_count, template?.sent_count)}
              />
              <p className="text-xs leading-5 text-slate-400">
                As taxas são atualizadas pelos eventos recebidos do SendPulse.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}

function TemplateEditorDialog({
  open,
  setOpen,
  template,
  onSaved,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  template: Template | null;
  onSaved: (item: Template) => void;
}) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [textBody, setTextBody] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [editorTab, setEditorTab] = useState<'content' | 'html' | 'text'>(
    'content',
  );
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(template?.name ?? '');
    setSubject(template?.subject ?? '');
    setPreheader(template?.preheader ?? '');
    setTextBody(template?.text_body ?? '');
    setHtmlBody(template?.html_body ?? '');
    setEditorTab('content');
    setError('');
  }, [open, template]);

  function addVariable(variable: string) {
    if (editorTab === 'content') setSubject((value) => `${value}${variable}`);
    if (editorTab === 'html') setHtmlBody((value) => `${value}${variable}`);
    if (editorTab === 'text') setTextBody((value) => `${value}${variable}`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { name, subject, preheader, textBody, htmlBody };
    try {
      const update = Boolean(template && template.id > 0);
      const response = await fetch(
        update ? `/api/templates/${template?.id}` : '/api/templates',
        {
          method: update ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? 'Não foi possível salvar o modelo.');
        return;
      }
      const data = (await response.json()) as { template: Template };
      onSaved(data.template);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const personalizedSubject = personalize(subject);
  const personalizedPreheader = personalize(preheader);
  const personalizedHtml = personalize(htmlBody);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-6xl">
        <form onSubmit={submit} className="flex max-h-[92vh] flex-col">
          <DialogHeader>
            <div className="border-b px-6 py-5">
              <DialogTitle>
                {template ? 'Editar modelo' : 'Novo modelo'}
              </DialogTitle>
              <DialogDescription>
                Controle o que o lead vê na caixa de entrada e confira a prévia
                antes de salvar.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="grid min-h-0 flex-1 overflow-auto xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]">
            <div className="space-y-5 border-r p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome interno do modelo">
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    placeholder="Ex.: Diagnóstico operacional"
                  />
                </Field>
                <Field label="Preheader">
                  <Input
                    value={preheader}
                    onChange={(event) => setPreheader(event.target.value)}
                    placeholder="Complemento exibido após o assunto"
                  />
                </Field>
              </div>
              <Field label="Assunto apresentado ao destinatário">
                <Input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  placeholder="Uma ideia para a {empresa}"
                />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-3 border-y py-3">
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(['content', 'html', 'text'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setEditorTab(tab)}
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold ${editorTab === tab ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                    >
                      {tab === 'content'
                        ? 'Conteúdo'
                        : tab === 'html'
                          ? 'HTML'
                          : 'Texto puro'}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {['{empresa}', '{razao_social}', '{cnpj}'].map((variable) => (
                    <Button
                      key={variable}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addVariable(variable)}
                      className="h-8 font-mono text-xs"
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>
              {editorTab === 'content' && (
                <div className="space-y-4 rounded-xl border bg-slate-50 p-4">
                  <p className="text-sm font-semibold">Conteúdo principal</p>
                  <Field label="Título do e-mail">
                    <Input
                      value={stripHtmlHeading(htmlBody)}
                      onChange={(event) =>
                        setHtmlBody(
                          buildSimpleEmail(event.target.value, textBody),
                        )
                      }
                      placeholder="Menos tarefas manuais. Mais espaço para crescer."
                    />
                  </Field>
                  <Field label="Mensagem">
                    <Textarea
                      value={textBody}
                      onChange={(event) => {
                        setTextBody(event.target.value);
                        if (!htmlBody)
                          setHtmlBody(
                            buildSimpleEmail(subject, event.target.value),
                          );
                      }}
                      required
                      className="min-h-48 bg-white"
                      placeholder="Olá, equipe da {empresa}..."
                    />
                  </Field>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Use a aba HTML para controle total do layout. A versão em
                    texto puro melhora compatibilidade e entregabilidade.
                  </p>
                </div>
              )}
              {editorTab === 'html' && (
                <Field label="HTML completo do e-mail">
                  <Textarea
                    value={htmlBody}
                    onChange={(event) => setHtmlBody(event.target.value)}
                    required
                    className="min-h-[360px] font-mono text-xs leading-5"
                    placeholder='<table role="presentation">...</table>'
                  />
                </Field>
              )}
              {editorTab === 'text' && (
                <Field label="Versão em texto puro">
                  <Textarea
                    value={textBody}
                    onChange={(event) => setTextBody(event.target.value)}
                    required
                    className="min-h-[360px] font-mono text-sm leading-6"
                  />
                </Field>
              )}
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>
            <div className="bg-slate-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-bold">Prévia em tempo real</p>
                  <p className="text-xs text-muted-foreground">
                    Dados de exemplo aplicados
                  </p>
                </div>
                <div className="flex rounded-lg bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMobilePreview(false)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${!mobilePreview ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobilePreview(true)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${mobilePreview ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    Celular
                  </button>
                </div>
              </div>
              <div
                className={`mx-auto overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${mobilePreview ? 'max-w-[360px]' : 'max-w-[620px]'}`}
              >
                <div className="border-b bg-white p-4">
                  <p className="truncate text-sm font-bold">
                    {personalizedSubject || 'Seu assunto aparecerá aqui'}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {personalizedPreheader ||
                      'O preheader complementa o assunto na caixa de entrada.'}
                  </p>
                </div>
                <iframe
                  title="Prévia segura do e-mail"
                  sandbox=""
                  srcDoc={
                    personalizedHtml ||
                    buildSimpleEmail(personalizedSubject, personalize(textBody))
                  }
                  className="h-[430px] w-full bg-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save /> {saving ? 'Salvando...' : 'Salvar modelo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TemplateDialog({
  open,
  setOpen,
  onSaved,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved: (item: Template) => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get('name'),
      subject: form.get('subject'),
      textBody: form.get('textBody'),
      htmlBody: form.get('htmlBody'),
    };
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = (await response.json()) as { template: Template };
      onSaved(data.template);
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>Novo modelo</DialogTitle>
            <DialogDescription>
              Use {'{empresa}'} para personalizar o conteúdo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Nome do modelo">
              <Input
                name="name"
                required
                placeholder="Ex.: Diagnóstico operacional"
              />
            </Field>
            <Field label="Assunto">
              <Input
                name="subject"
                required
                placeholder="Uma ideia para a {empresa}"
              />
            </Field>
            <Field label="Versão em texto">
              <Textarea name="textBody" required className="min-h-28" />
            </Field>
            <Field label="HTML">
              <Textarea
                name="htmlBody"
                required
                className="min-h-40 font-mono text-xs"
                placeholder="<h1>...</h1>"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save /> Salvar modelo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CampaignDialog({
  open,
  setOpen,
  templates,
  onSaved,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  templates: Template[];
  onSaved: (item: Campaign) => void;
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');

  useEffect(() => {
    if (!open || !templates.length) return;
    const first = templates[0];
    setSelectedTemplateId(String(first.id));
    setCampaignSubject(first.subject);
  }, [open, templates]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedTemplate = templates.find(
      (item) => item.id === Number(selectedTemplateId),
    );
    const payload = {
      name: form.get('name'),
      audience: form.get('audience'),
      templateId: selectedTemplateId,
      subject: campaignSubject,
      scheduledAt: form.get('scheduledAt'),
      dailyLimit: form.get('dailyLimit'),
      textBody: selectedTemplate?.text_body ?? '',
      htmlBody: selectedTemplate?.html_body ?? '',
    };
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = (await response.json()) as { campaign: Campaign };
      onSaved({ ...data.campaign, template_name: selectedTemplate?.name });
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>Nova campanha</DialogTitle>
            <DialogDescription>
              Crie como rascunho para revisar antes de liberar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Nome">
              <Input
                name="name"
                required
                placeholder="Ex.: Automação para varejo"
              />
            </Field>
            <Field label="Público">
              <Input
                name="audience"
                required
                placeholder="Leads qualificados do varejo"
              />
            </Field>
            <Field label="Modelo">
              <select
                name="templateId"
                value={selectedTemplateId}
                onChange={(event) => {
                  setSelectedTemplateId(event.target.value);
                  const selected = templates.find(
                    (item) => item.id === Number(event.target.value),
                  );
                  setCampaignSubject(selected?.subject ?? '');
                }}
                className="h-10 rounded-lg border bg-white px-3"
                required
              >
                {templates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assunto que será apresentado">
              <Input
                value={campaignSubject}
                onChange={(event) => setCampaignSubject(event.target.value)}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agendamento">
                <Input name="scheduledAt" type="datetime-local" />
              </Field>
              <Field label="Limite diário">
                <Input name="dailyLimit" type="number" defaultValue="30" />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save /> Criar rascunho
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PreviewDialog({
  template,
  close,
}: {
  template: Template | null;
  close: () => void;
}) {
  const [mobile, setMobile] = useState(false);
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="h-[92vh] overflow-hidden p-0 sm:max-w-[96vw] xl:max-w-7xl">
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 border-b px-6 py-5 pr-14">
              <div>
                <DialogTitle className="text-xl">Prévia do modelo</DialogTitle>
                <DialogDescription>
                  Confira como a mensagem chega ao destinatário.
                </DialogDescription>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMobile(false)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${!mobile ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setMobile(true)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${mobile ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
                >
                  Celular
                </button>
              </div>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto bg-slate-200 p-4 sm:p-8">
            <div
              className={`mx-auto flex min-h-full flex-col overflow-hidden rounded-xl border bg-white shadow-xl transition-all ${mobile ? 'max-w-[390px]' : 'max-w-[980px]'}`}
            >
              <div className="border-b px-5 py-4">
                <p className="truncate text-base font-bold">
                  {personalize(template?.subject ?? '') || 'Assunto do e-mail'}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {personalize(template?.preheader ?? '') ||
                    'Preheader do e-mail'}
                </p>
              </div>
              <iframe
                title="Prévia segura do modelo"
                sandbox=""
                srcDoc={personalize(template?.html_body ?? '')}
                className="min-h-[620px] w-full flex-1 bg-white"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PageIntro({
  title,
  description,
  action,
  onAction,
  icon: Icon = Plus,
}: {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  icon?: typeof Plus;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button onClick={onAction}>
          <Icon /> {action}
        </Button>
      )}
    </div>
  );
}
function Metric({
  label,
  value,
  detail,
  icon: Icon,
  positive = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Send;
  positive?: boolean;
}) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          <p
            className={`mt-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-muted-foreground'}`}
          >
            {detail}
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-[#eeefff] text-[#5b5cf0]">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function TemplateMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-base font-bold text-slate-950">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function rate(value?: number, total?: number) {
  if (!total) return '0%';
  return `${((Number(value ?? 0) / total) * 100).toFixed(1).replace('.', ',')}%`;
}

function ProgressBar({
  value,
  warning = false,
  compact = false,
}: {
  value: number;
  warning?: boolean;
  compact?: boolean;
}) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
  const color = warning && safeValue >= 85 ? 'bg-rose-500' : 'bg-violet-600';
  return (
    <div
      className={`${compact ? 'h-1.5' : 'h-2.5'} overflow-hidden rounded-full bg-slate-200`}
    >
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-500`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function RuntimeMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function percentage(value?: number | null, total?: number | null) {
  if (!total) return 0;
  return Math.min(100, Math.max(0, (Number(value ?? 0) / total) * 100));
}

function formatCount(value?: number | null) {
  return new Intl.NumberFormat('pt-BR').format(Number(value ?? 0));
}

function formatBytes(value?: number | null) {
  const bytes = Number(value ?? 0);
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  return `${(bytes / 1024 ** index).toLocaleString('pt-BR', {
    maximumFractionDigits: index === 0 ? 0 : 1,
  })} ${units[index]}`;
}

function schemaLabel(schema: string) {
  const labels: Record<string, string> = {
    cnpj: 'Empresas e dados da Receita',
    intelligence: 'Inteligência comercial',
    etl: 'Controle das cargas',
  };
  return labels[schema] ?? schema;
}

function intelligenceSourceLabel(source: string) {
  const labels: Record<string, string> = {
    receita: 'Receita Federal',
    email_quality: 'Qualidade do e-mail',
    website: 'Site institucional',
    rdap: 'Registro do domínio',
    cvm: 'CVM',
    gdelt: 'Notícias (GDELT)',
    pncp: 'Contratações públicas',
    inpi: 'Marcas e patentes',
    google_places: 'Google Business',
    pagespeed: 'PageSpeed',
    meta_ads: 'Meta Ads',
    google_ads: 'Google Ads',
    people_provider: 'Pessoas e decisores',
  };
  return labels[source] ?? source;
}

function runtimeLogClassName(line: string) {
  const normalized = line.toUpperCase();
  if (
    normalized.includes('[ERROR') ||
    normalized.includes('[ERRO') ||
    normalized.includes('[FAILED') ||
    normalized.includes('TRACEBACK')
  ) {
    return 'border-rose-500 bg-rose-500/10 text-rose-200';
  }
  if (
    normalized.includes('[WARNING') ||
    normalized.includes('[AVISO') ||
    normalized.includes('TIMEOUT')
  ) {
    return 'border-amber-400 bg-amber-400/10 text-amber-100';
  }
  if (
    normalized.includes('[AGORA]') ||
    normalized.includes('[ATIVIDADE]') ||
    normalized.includes('[IN_PROGRESS]')
  ) {
    return 'border-violet-400 bg-violet-400/10 text-violet-100';
  }
  if (
    normalized.includes('[SUCCESS') ||
    normalized.includes('[COMPLETED]') ||
    normalized.includes('CONCLUÍDO')
  ) {
    return 'border-emerald-500/70 text-emerald-200';
  }
  if (
    normalized.includes('[ETL]') ||
    normalized.includes('[BASE]') ||
    normalized.includes('[INTELIGÊNCIA]') ||
    normalized.includes('[ENRIQUECIMENTO]') ||
    normalized.includes('[ARMAZENAMENTO]') ||
    normalized.includes('[ARQUIVO:')
  ) {
    return 'border-sky-400/70 bg-sky-400/5 text-sky-100';
  }
  return 'border-transparent text-slate-300';
}

function fileStatus(status: string) {
  const labels: Record<string, string> = {
    pending: 'Aguardando',
    downloading: 'Baixando',
    processing: 'Processando',
    success: 'Concluído',
    failed: 'Falhou',
  };
  return labels[status] ?? status;
}

function percentWidth(value?: number, total?: number) {
  if (!total) return '0%';
  return `${Math.min(100, Math.max(0, (Number(value ?? 0) / total) * 100))}%`;
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Não agendado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
}

function formatTime(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
}

function activityAge(value?: string | null, compact = false) {
  if (!value)
    return compact ? 'Aguardando sinal' : 'Aguardando a primeira atualização';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return compact ? 'Atualização ativa' : value;
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 8) return compact ? 'Agora' : 'Atualizado agora';
  if (seconds < 60)
    return compact ? `${seconds}s atrás` : `Última atualização há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return compact
      ? `${minutes}min atrás`
      : `Última atualização há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return compact ? `${hours}h atrás` : `Última atualização há ${hours} h`;
}

function contactStatus(status: string) {
  const labels: Record<string, string> = {
    new: 'Novo',
    ready: 'Pronto',
    contacted: 'Contatado',
    replied: 'Respondido',
    bounced: 'Falhou',
    unsubscribed: 'Descadastrado',
  };
  return labels[status] ?? status;
}

function queueStatus(status: string) {
  const labels: Record<string, string> = {
    pending: 'Aguardando',
    pending_approval: 'Aguardando aprovação',
    approved: 'Aprovado',
    queued: 'Na fila',
    scheduled: 'Agendado',
    sending: 'Enviando',
    sent: 'Enviado',
    delivered: 'Entregue',
    bounced: 'Devolvido',
    replied: 'Respondeu',
    unsubscribed: 'Descadastrado',
    failed: 'Falhou',
  };
  return labels[status] ?? status;
}

function workflowStatus(status: string) {
  const labels: Record<string, string> = {
    queued: 'Na fila',
    in_progress: 'Em execução',
    completed: 'Concluído',
    requested: 'Solicitado',
    waiting: 'Aguardando',
    pending: 'Pendente',
  };
  return labels[status] ?? status;
}

function workflowConclusion(conclusion?: string | null) {
  if (!conclusion) return '—';
  const labels: Record<string, string> = {
    success: 'Sucesso',
    failure: 'Falhou',
    cancelled: 'Cancelado',
    skipped: 'Ignorado',
    timed_out: 'Tempo esgotado',
    action_required: 'Ação necessária',
  };
  return labels[conclusion] ?? conclusion;
}

function sumCampaignMetrics(campaigns: Campaign[]) {
  return campaigns.reduce(
    (total, campaign) => ({
      sent: total.sent + Number(campaign.sent_count ?? 0),
      delivered: total.delivered + Number(campaign.delivered_count ?? 0),
      opened: total.opened + Number(campaign.opened_count ?? 0),
      clicked: total.clicked + Number(campaign.clicked_count ?? 0),
      replied: total.replied + Number(campaign.replied_count ?? 0),
      bounced: total.bounced + Number(campaign.bounced_count ?? 0),
    }),
    { sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0 },
  );
}

function personalize(value: string) {
  return value
    .replaceAll('{empresa}', 'Empresa de exemplo')
    .replaceAll('{razao_social}', 'Empresa de exemplo Ltda.')
    .replaceAll('{cnpj}', '12.345.678/0001-90');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildSimpleEmail(title: string, body: string) {
  const safeTitle = escapeHtml(title || 'Sua mensagem');
  const safeBody = escapeHtml(
    body || 'Escreva a mensagem do e-mail.',
  ).replaceAll('\n', '<br>');
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:28px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px"><tr><td style="padding:36px"><div style="font-size:20px;font-weight:800;margin-bottom:28px">Mestre<span style="color:#5b5cf0">Lead</span></div><h1 style="font-size:28px;line-height:1.2;margin:0 0 20px">${safeTitle}</h1><div style="font-size:16px;line-height:1.7">${safeBody}</div></td></tr></table></td></tr></table></body></html>`;
}

function stripHtmlHeading(value: string) {
  const match = value.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return match?.[1]?.replace(/<[^>]+>/g, '') ?? '';
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === 'active'
      ? 'Em envio'
      : status === 'scheduled'
        ? 'Agendada'
        : 'Rascunho';
  const styles =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'scheduled'
        ? 'bg-indigo-50 text-indigo-700'
        : 'bg-slate-100 text-slate-600';
  return (
    <Badge className={styles} variant="secondary">
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}
function ControlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
      <CardHeader>
        <CardTitle className="font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Toggle({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-lg border p-4">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
function Health({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-[#5b5cf0]" style={{ width }} />
      </div>
    </div>
  );
}

declare global {
  interface Document {
    modelContext?: {
      registerTool(
        tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: object;
          annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute(input: unknown): unknown;
        },
        options?: { signal?: AbortSignal },
      ): void | Promise<void>;
    };
  }
}
