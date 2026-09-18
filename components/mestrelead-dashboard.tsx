'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Gauge,
  Mail,
  MoreHorizontal,
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

type View =
  | 'overview'
  | 'campaigns'
  | 'templates'
  | 'contacts'
  | 'queue'
  | 'reports'
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

const nav: { id: View; label: string; icon: typeof Gauge }[] = [
  { id: 'overview', label: 'Visão geral', icon: Gauge },
  { id: 'campaigns', label: 'Campanhas', icon: Send },
  { id: 'templates', label: 'Modelos', icon: FileText },
  { id: 'contacts', label: 'Contatos', icon: Users },
  { id: 'queue', label: 'Fila de envio', icon: Activity },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const sampleTemplates: Template[] = [
  {
    id: -1,
    name: 'Tecnologia para crescer',
    subject: 'Uma ideia para a {empresa}',
    preheader: 'Uma direção prática para reduzir tarefas manuais.',
    text_body:
      'Olá, equipe da {empresa}. Podemos analisar um processo manual da sua operação?',
    html_body: '<h1>Menos tarefas manuais. Mais espaço para crescer.</h1>',
    updated_at: '2026-09-18T09:20:00Z',
    sent_count: 436,
    opened_count: 198,
    clicked_count: 54,
    replied_count: 19,
  },
  {
    id: -2,
    name: 'Follow-up consultivo',
    subject: 'Re: Uma ideia para a {empresa}',
    preheader: 'Podemos retomar esta conversa?',
    text_body:
      'Retomando nosso contato sobre automação e IA aplicada ao negócio.',
    html_body: '<p>Podemos retomar esta conversa?</p>',
    updated_at: '2026-09-16T14:00:00Z',
    sent_count: 146,
    opened_count: 79,
    clicked_count: 21,
    replied_count: 12,
  },
];

const sampleCampaigns: Campaign[] = [
  {
    id: -1,
    name: 'Automação com IA',
    template_name: 'Tecnologia para crescer',
    subject: 'Uma ideia para a {empresa}',
    audience: 'Leads qualificados',
    status: 'active',
    daily_limit: 30,
    sent_count: 436,
    delivered_count: 430,
    opened_count: 198,
    clicked_count: 54,
    replied_count: 19,
    bounced_count: 6,
  },
  {
    id: -2,
    name: 'Diagnóstico operacional',
    template_name: 'Tecnologia para crescer',
    subject: 'Como a {empresa} pode reduzir tarefas manuais',
    audience: 'Varejo e serviços',
    status: 'draft',
    daily_limit: 20,
  },
  {
    id: -3,
    name: 'Follow-up • Automação',
    template_name: 'Follow-up consultivo',
    subject: 'Re: Uma ideia para a {empresa}',
    audience: 'Sem resposta há 7 dias',
    status: 'scheduled',
    daily_limit: 12,
    sent_count: 146,
    delivered_count: 144,
    opened_count: 79,
    clicked_count: 21,
    replied_count: 12,
    bounced_count: 2,
  },
];

const contacts = [
  {
    company: 'Atlas Comércio',
    email: 'contato@atlas.com.br',
    score: 92,
    status: 'Pronto',
    lastSubject: 'Uma ideia para a Atlas Comércio',
    opens: 3,
  },
  {
    company: 'Lumina Serviços',
    email: 'comercial@lumina.com.br',
    score: 86,
    status: 'Pronto',
    lastSubject: 'Como a Lumina pode reduzir tarefas manuais',
    opens: 1,
  },
  {
    company: 'Norte Sul Equipamentos',
    email: 'vendas@nortesul.com.br',
    score: 79,
    status: 'Contatado',
    lastSubject: 'Uma ideia para a Norte Sul Equipamentos',
    opens: 2,
  },
  {
    company: 'Forma Engenharia',
    email: 'contato@forma.eng.br',
    score: 74,
    status: 'Respondido',
    lastSubject: 'Re: Uma ideia para a Forma Engenharia',
    opens: 4,
  },
];

const queue = [
  {
    company: 'Atlas Comércio',
    campaign: 'Automação com IA',
    subject: 'Uma ideia para a Atlas Comércio',
    when: 'Hoje, 10:24',
    status: 'Próximo',
  },
  {
    company: 'Lumina Serviços',
    campaign: 'Automação com IA',
    subject: 'Uma ideia para a Lumina Serviços',
    when: 'Hoje, 10:30',
    status: 'Agendado',
  },
  {
    company: 'Neon Varejo',
    campaign: 'Automação com IA',
    subject: 'Uma ideia para a Neon Varejo',
    when: 'Hoje, 10:36',
    status: 'Agendado',
  },
  {
    company: 'Forma Engenharia',
    campaign: 'Follow-up • Automação',
    subject: 'Re: Uma ideia para a Forma Engenharia',
    when: 'Hoje, 10:42',
    status: 'Agendado',
  },
];

export function MestreLeadDashboard({ userName }: { userName: string }) {
  const [view, setView] = useState<View>('overview');
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [preview, setPreview] = useState<Template | null>(null);
  const [paused, setPaused] = useState(false);
  const [notice, setNotice] = useState('');

  async function refresh() {
    try {
      const [templateResponse, campaignResponse] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/campaigns'),
      ]);
      if (templateResponse.ok) {
        const data = (await templateResponse.json()) as {
          templates: Template[];
        };
        if (data.templates.length) setTemplates(data.templates);
      }
      if (campaignResponse.ok) {
        const data = (await campaignResponse.json()) as {
          campaigns: Campaign[];
        };
        if (data.campaigns.length) setCampaigns(data.campaigns);
      }
    } catch {
      setNotice(
        'A prévia está usando dados demonstrativos até a conexão ser configurada.',
      );
    }
  }

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(timer);
  }, []);

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
        <div className="p-5 md:p-8">
          {view === 'overview' && (
            <Overview campaigns={campaigns} setView={setView} paused={paused} />
          )}
          {view === 'campaigns' && (
            <Campaigns
              campaigns={campaigns}
              openCreate={() => setCampaignOpen(true)}
            />
          )}
          {view === 'templates' && (
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
          )}
          {view === 'contacts' && <Contacts />}
          {view === 'queue' && (
            <Queue
              paused={paused}
              setPaused={setPaused}
              setNotice={setNotice}
            />
          )}
          {view === 'reports' && <Reports campaigns={campaigns} />}
          {view === 'settings' && <DeliverySettings setNotice={setNotice} />}
        </div>
      </main>
      <TemplateEditorDialog
        open={templateOpen}
        setOpen={setTemplateOpen}
        template={editingTemplate}
        onSaved={(item) => {
          setTemplates((current) => [
            item,
            ...current.filter((row) => row.id !== item.id && row.id > 0),
          ]);
          setNotice('Modelo salvo com sucesso.');
        }}
      />
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
  setView,
  paused,
}: {
  campaigns: Campaign[];
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
          value="42"
          detail="próximos 4 dias"
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
              <ControlRow label="Limite diário" value="30" />
              <ControlRow label="Limite por hora" value="10" />
              <ControlRow label="Intervalo" value="6 min" />
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

function Contacts() {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Contatos"
        description="Leads sincronizados e prontos para segmentação."
        action="Importar contatos"
      />
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 pl-9"
              placeholder="Buscar empresa ou e-mail"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Empresa</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Último assunto apresentado</TableHead>
                <TableHead className="text-right">Aberturas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.email} className="h-15">
                  <TableCell className="pl-5 font-semibold">
                    {contact.company}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.score}</TableCell>
                  <TableCell className="max-w-[340px] truncate text-muted-foreground">
                    {contact.lastSubject}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {contact.opens}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{contact.status}</Badge>
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

function Queue({
  paused,
  setPaused,
  setNotice,
}: {
  paused: boolean;
  setPaused: (paused: boolean) => void;
  setNotice: (notice: string) => void;
}) {
  const [running, setRunning] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [processed, setProcessed] = useState(18);
  const [success, setSuccess] = useState(18);
  const [failed] = useState(0);
  const [logs, setLogs] = useState([
    {
      time: '10:18:04',
      level: 'success',
      message: 'Mensagem aceita para contato@verta.com.br',
    },
    {
      time: '10:12:02',
      level: 'success',
      message: 'Mensagem aceita para comercial@novolar.com.br',
    },
    {
      time: '10:06:01',
      level: 'info',
      message: 'Cadência respeitada: aguardando 6 minutos',
    },
  ]);

  useEffect(() => {
    if (!running || paused || processed >= 30) return;
    const timer = window.setInterval(() => {
      setProcessed((value) => Math.min(30, value + 1));
      setSuccess((value) => value + 1);
      const now = new Date().toLocaleTimeString('pt-BR', { hour12: false });
      setLogs((current) =>
        [
          {
            time: now,
            level: 'success',
            message: `Mensagem aceita para o próximo contato da fila`,
          },
          ...current,
        ].slice(0, 8),
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [running, paused, processed]);

  const progress = Math.round((processed / 30) * 100);
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
          <Button variant="outline" onClick={() => setScheduleOpen(true)}>
            <CalendarClock /> Agendar envio
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
                  setRunning(false);
                  setNotice(
                    'Execução interrompida. Mensagens não iniciadas permaneceram na fila.',
                  );
                }}
              >
                <Square /> Interromper
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setRunning(true);
                setPaused(false);
                setNotice(
                  'Envio manual iniciado. A central será atualizada em tempo real.',
                );
              }}
            >
              <Send /> Enviar agora
            </Button>
          )}
        </div>
      </div>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Andamento em tempo real"
      >
        <Metric
          label="Processados"
          value={`${processed}/30`}
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
          value="10/h"
          detail="cadência protegida"
          icon={Clock3}
        />
      </section>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-bold">Progresso da execução</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Próximo envio em até 6 minutos.
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
          {queue.map((item, index) => (
            <div
              key={item.company}
              className="grid gap-3 px-5 py-4 md:grid-cols-[44px_1fr_1.35fr_150px_120px] md:items-center"
            >
              <span className="grid size-9 place-items-center rounded-full bg-slate-100 font-mono text-sm">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-semibold">{item.company}</p>
                <p className="text-sm text-muted-foreground">{item.campaign}</p>
              </div>
              <div>
                <p className="truncate text-sm font-medium">{item.subject}</p>
                <p className="text-xs text-muted-foreground">{item.when}</p>
              </div>
              <Badge
                className={index === 0 ? 'bg-indigo-50 text-indigo-700' : ''}
                variant="secondary"
              >
                <Clock3 /> {item.status}
              </Badge>
              <Button variant="ghost" size="sm">
                Detalhes
              </Button>
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
          {logs.map((log, index) => (
            <div
              key={`${log.time}-${index}`}
              className="grid grid-cols-[76px_76px_1fr] gap-3 rounded px-2 py-2 hover:bg-white/5"
            >
              <span className="text-slate-500">{log.time}</span>
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

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agendar envio automático</DialogTitle>
            <DialogDescription>
              Escolha quando a campanha entra na fila. Os limites de segurança
              continuam valendo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Campanha">
              <select className="h-10 rounded-lg border bg-white px-3">
                <option>Automação com IA</option>
                <option>Follow-up • Automação</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Data">
                <Input type="date" />
              </Field>
              <Field label="Horário">
                <Input type="time" defaultValue="09:00" />
              </Field>
            </div>
            <Field label="Recorrência">
              <select className="h-10 rounded-lg border bg-white px-3">
                <option>Uma vez</option>
                <option>Diariamente</option>
                <option>Dias úteis</option>
                <option>Semanalmente</option>
              </select>
            </Field>
            <Toggle
              label="Iniciar automaticamente"
              description="Sem exigir clique manual no horário agendado."
              checked={true}
              onCheckedChange={() => undefined}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setScheduleOpen(false);
                setNotice(
                  'Envio agendado. Ele aparecerá na central antes de iniciar.',
                );
              }}
            >
              <CalendarClock /> Confirmar agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          <Health label="Reputação do domínio" value="Boa" width="88%" />
          <Health label="Qualidade da base" value="Alta" width="92%" />
          <Health label="Cadência" value="Conservadora" width="76%" />
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

function DeliverySettings({
  setNotice,
}: {
  setNotice: (notice: string) => void;
}) {
  const [approval, setApproval] = useState(true);
  const [dryRun, setDryRun] = useState(true);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromName: form.get('fromName'),
        fromEmail: form.get('fromEmail'),
        replyTo: form.get('replyTo'),
        dailyLimit: form.get('dailyLimit'),
        hourlyLimit: form.get('hourlyLimit'),
        domainDailyLimit: form.get('domainDailyLimit'),
        intervalSeconds: Number(form.get('intervalMinutes')) * 60,
        sendStartHour: form.get('sendStartHour'),
        sendEndHour: form.get('sendEndHour'),
        requireApproval: approval,
        dryRun,
      }),
    });
    setNotice(
      response.ok
        ? 'Configurações salvas.'
        : 'Não foi possível salvar as configurações.',
    );
  }
  return (
    <form onSubmit={save} className="space-y-5">
      <PageIntro
        title="Configurações de envio"
        description="Identidade do remetente, limites e proteções operacionais."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsCard title="Remetente">
          <Field label="Nome">
            <Input name="fromName" defaultValue="Tironi Tech" />
          </Field>
          <Field label="E-mail">
            <Input
              name="fromEmail"
              type="email"
              placeholder="tironi@tironitech.com"
            />
          </Field>
          <Field label="Responder para">
            <Input
              name="replyTo"
              type="email"
              placeholder="tironi@tironitech.com"
            />
          </Field>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <ShieldCheck className="mr-2 inline size-4" />
            SendPulse SMTP selecionado
          </div>
        </SettingsCard>
        <SettingsCard title="Cadência">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Por dia">
              <Input name="dailyLimit" type="number" defaultValue="30" />
            </Field>
            <Field label="Por hora">
              <Input name="hourlyLimit" type="number" defaultValue="10" />
            </Field>
            <Field label="Por domínio/dia">
              <Input name="domainDailyLimit" type="number" defaultValue="2" />
            </Field>
            <Field label="Intervalo (min)">
              <Input name="intervalMinutes" type="number" defaultValue="6" />
            </Field>
            <Field label="Início">
              <Input name="sendStartHour" type="number" defaultValue="9" />
            </Field>
            <Field label="Fim">
              <Input name="sendEndHour" type="number" defaultValue="17" />
            </Field>
          </div>
        </SettingsCard>
        <SettingsCard title="Proteções">
          <Toggle
            label="Exigir aprovação"
            description="Mensagens só entram na fila depois de revisão."
            checked={approval}
            onCheckedChange={setApproval}
          />
          <Toggle
            label="Modo seguro"
            description="Prepara a campanha sem realizar envios."
            checked={dryRun}
            onCheckedChange={setDryRun}
          />
        </SettingsCard>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          <Save /> Salvar configurações
        </Button>
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
    const payload = {
      name: form.get('name'),
      audience: form.get('audience'),
      templateId: selectedTemplateId,
      subject: campaignSubject,
      scheduledAt: form.get('scheduledAt'),
      dailyLimit: form.get('dailyLimit'),
    };
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = (await response.json()) as { campaign: Campaign };
      const selected = templates.find(
        (item) => item.id === Number(payload.templateId),
      );
      onSaved({ ...data.campaign, template_name: selected?.name });
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
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prévia do modelo</DialogTitle>
          <DialogDescription>{template?.subject}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto rounded-lg bg-slate-100 p-5">
          <div className="mx-auto max-w-[560px] rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-8 text-xl font-extrabold">
              Mestre<span className="text-[#5b5cf0]">Lead</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: template?.html_body ?? '' }}
            />
            <p className="mt-8 border-t pt-5 text-xs text-slate-500">
              Prévia visual. O descadastro é incluído automaticamente no envio.
            </p>
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
    .replaceAll('{empresa}', 'Atlas Comércio')
    .replaceAll('{razao_social}', 'Atlas Comércio Ltda.')
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
