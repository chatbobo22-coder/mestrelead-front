'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ArrowRight, Building2, ExternalLink, Flame, Search, Sparkles, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Signal = { id?: number; signal_type?: string; label?: string; title?: string; description?: string; impact?: number; confidence?: number; source_name?: string; source_url?: string; observed_at?: string };
type Person = { name: string; role?: string; linkedin_url?: string; email?: string; phone?: string; confidence?: number; source?: string };
type Opportunity = {
  cnpj: string; razao_social: string; nome_fantasia?: string; uf?: string; municipio_descricao?: string;
  email?: string; telefone_1?: string; website?: string; lead_id?: number; segment_fit: string;
  tironi_score: number; classification: string; employee_count?: number; active_units: number;
  why_this_lead: string; recommended_products: string[]; recommended_plan: string;
  next_best_action: string; sales_approach: string; top_signals?: Signal[];
  technologies?: { technology: string; category: string }[]; primary_decision_maker?: Person;
  latest_signal_at?: string; signals_count: number; signals?: Signal[]; decision_makers?: Person[];
  score_history?: { tironi_score: number; classification: string; calculated_at: string }[];
};
type Result = { items: Opportunity[]; total: number; page: number; page_size: number; pages: number };

const PRESETS = [
  ['ecommerce_hot', 'E-commerce quente'], ['automotive', 'Concessionárias'],
  ['distributors', 'Distribuidores B2B'], ['ai_hiring', 'Contratando IA'],
  ['dev_hiring', 'Contratando dev'], ['expanding_networks', 'Redes em expansão'],
] as const;

const CLASS_STYLE: Record<string, string> = {
  FRIO: 'bg-slate-100 text-slate-700', POTENCIAL: 'bg-sky-100 text-sky-800',
  QUENTE: 'bg-amber-100 text-amber-800', 'MUITO QUENTE': 'bg-orange-100 text-orange-800',
  'PRIORIDADE COMERCIAL': 'bg-rose-100 text-rose-800',
};

export function IntentEngine({ mode, setNotice }: { mode: 'search' | 'priority'; setNotice: (value: string) => void }) {
  const [result, setResult] = useState<Result>({ items: [], total: 0, page: 1, page_size: 25, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [preset, setPreset] = useState('');
  const [minScore, setMinScore] = useState(mode === 'priority' ? '40' : '0');
  const [state, setState] = useState('');
  const [segment, setSegment] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);
  const [detail, setDetail] = useState<Opportunity | null>(null);

  async function load(page = 1, overrides: Record<string, string> = {}) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), page_size: '25', min_score: minScore, ...overrides });
    if (query) params.set('q', query);
    if (preset) params.set('preset', preset);
    if (state) params.set('state', state.toUpperCase());
    if (segment) params.set('segment_fit', segment);
    if (whatsapp) params.set('has_whatsapp', 'true');
    try {
      const response = await fetch(`/api/opportunities?${params}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.error || 'Falha na busca');
      setResult(data);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível buscar oportunidades.');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      page: '1',
      page_size: '25',
      min_score: mode === 'priority' ? '40' : '0',
    });
    fetch(`/api/opportunities?${params}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error || 'Falha na busca');
        if (active) setResult(data);
      })
      .catch((error) => {
        if (active) setNotice(error instanceof Error ? error.message : 'Não foi possível buscar oportunidades.');
      });
    return () => { active = false; };
  }, [mode, setNotice]);

  async function openDetail(cnpj: string) {
    const response = await fetch(`/api/opportunities/${cnpj}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) return setNotice(data.detail || data.error || 'Detalhes indisponíveis.');
    setDetail(data);
  }

  async function addToCrm(item: Opportunity) {
    if (!item.lead_id) return setNotice('Sincronize este lead com o Outreach antes de adicioná-lo ao CRM.');
    const response = await fetch('/api/crm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead_id: item.lead_id, service_type: 'prospecting' }) });
    setNotice(response.ok ? 'Lead adicionado ao CRM.' : 'Não foi possível adicionar o lead ao CRM.');
  }

  const priorityGroups = mode === 'priority' ? [
    ['Ligar agora', 80, 101], ['Abordar hoje', 70, 80], ['Nutrir', 40, 70], ['Monitorar', 0, 40],
  ] as const : [];

  return <div className="space-y-5">
    <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl"><Badge className="mb-3 bg-white/10 text-indigo-100">Intent-based B2B Lead Engine</Badge><h2 className="text-2xl font-bold">{mode === 'priority' ? 'Prioridade Comercial' : 'Busca Inteligente'}</h2><p className="mt-2 text-sm text-indigo-100">Empresa certa, momento certo, decisor certo e oferta recomendada — sempre com evidência rastreável.</p></div>
        <Button className="bg-white text-indigo-950 hover:bg-indigo-50" onClick={() => { setMinScore('60'); setPreset(''); void load(1, { min_score: '60' }); }}><Sparkles /> Encontrar oportunidades para a Tironi</Button>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Oportunidades encontradas" value={result.total} icon={<Target />} />
      <Metric label="Muito quentes na página" value={result.items.filter((x) => x.tironi_score >= 71).length} icon={<Flame />} />
      <Metric label="Com decisor identificado" value={result.items.filter((x) => x.primary_decision_maker).length} icon={<Users />} />
    </div>

    {mode === 'search' && <Card><CardContent className="space-y-4 pt-6">
      <form className="grid gap-3 md:grid-cols-[2fr_0.8fr_1fr_0.8fr_auto]" onSubmit={(event) => { event.preventDefault(); void load(); }}>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Empresa, CNPJ ou e-mail" />
        <Input value={state} onChange={(e) => setState(e.target.value)} maxLength={2} placeholder="UF" />
        <select className="h-9 rounded-lg border bg-white px-3 text-sm" value={segment} onChange={(e) => setSegment(e.target.value)}><option value="">Todos os segmentos</option><option value="ecommerce_retail">E-commerce / varejo</option><option value="automotive">Automotivo</option><option value="distributor_wholesale">Distribuidor B2B</option><option value="franchise_multiunit">Rede / franquia</option><option value="industry_b2b">Indústria B2B</option><option value="high_ticket_services">Serviços high ticket</option><option value="digital_company">Empresa digital</option></select>
        <Input type="number" min="0" max="100" value={minScore} onChange={(e) => setMinScore(e.target.value)} placeholder="Score mínimo" />
        <Button disabled={loading}><Search /> {loading ? 'Buscando…' : 'Buscar'}</Button>
      </form>
      <div className="flex flex-wrap gap-2">{PRESETS.map(([value, label]) => <Button key={value} variant={preset === value ? 'default' : 'outline'} size="sm" onClick={() => { setPreset(value); setTimeout(() => void load(1, { preset: value }), 0); }}>{label}</Button>)}<label className="flex items-center gap-2 rounded-lg border px-3 text-sm"><input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} /> WhatsApp</label></div>
    </CardContent></Card>}

    {mode === 'priority' ? <div className="grid gap-4 xl:grid-cols-4">{priorityGroups.map(([label, min, max]) => <Card key={label}><CardHeader><CardTitle className="flex items-center justify-between text-base">{label}<Badge variant="outline">{result.items.filter((x) => x.tironi_score >= min && x.tironi_score < max).length}</Badge></CardTitle></CardHeader><CardContent className="space-y-3">{result.items.filter((x) => x.tironi_score >= min && x.tironi_score < max).map((item) => <CompactOpportunity key={item.cnpj} item={item} openDetail={openDetail} />)}</CardContent></Card>)}</div> : <div className="space-y-3">{result.items.map((item) => <OpportunityCard key={item.cnpj} item={item} openDetail={openDetail} addToCrm={addToCrm} />)}</div>}

    {!loading && result.items.length === 0 && <Card><CardContent className="py-16 text-center text-muted-foreground">Nenhum perfil Tironi calculado ainda. A carga recalcula o score conforme as evidências chegam.</CardContent></Card>}
    {result.pages > 1 && <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Página {result.page} de {result.pages}</span><div className="flex gap-2"><Button variant="outline" disabled={result.page <= 1} onClick={() => void load(result.page - 1)}>Anterior</Button><Button variant="outline" disabled={result.page >= result.pages} onClick={() => void load(result.page + 1)}>Próxima</Button></div></div>}

    <OpportunityDetail item={detail} close={() => setDetail(null)} addToCrm={addToCrm} />
  </div>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) { return <Card><CardContent className="flex items-center justify-between pt-6"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value.toLocaleString('pt-BR')}</p></div><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">{icon}</div></CardContent></Card>; }
function Score({ item }: { item: Opportunity }) { return <div className="text-center"><div className="text-3xl font-black text-indigo-600">{item.tironi_score}</div><Badge className={CLASS_STYLE[item.classification] ?? ''}>{item.classification}</Badge></div>; }
function CompactOpportunity({ item, openDetail }: { item: Opportunity; openDetail: (cnpj: string) => void }) { return <button className="w-full rounded-xl border p-3 text-left hover:border-indigo-300" onClick={() => openDetail(item.cnpj)}><div className="flex justify-between gap-2"><strong className="line-clamp-2 text-sm">{item.nome_fantasia || item.razao_social}</strong><span className="font-bold text-indigo-600">{item.tironi_score}</span></div><p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.why_this_lead}</p></button>; }
function OpportunityCard({ item, openDetail, addToCrm }: { item: Opportunity; openDetail: (cnpj: string) => void; addToCrm: (item: Opportunity) => void }) { return <Card><CardContent className="grid gap-5 pt-6 lg:grid-cols-[90px_1.4fr_1.5fr_1fr_auto]"><Score item={item} /><div><h3 className="font-bold">{item.nome_fantasia || item.razao_social}</h3><p className="text-sm text-muted-foreground">{item.municipio_descricao}/{item.uf} · {segmentLabel(item.segment_fit)}</p><a className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600" href={item.website} target="_blank" rel="noreferrer">{item.website || 'Site não confirmado'} {item.website && <ExternalLink className="size-3" />}</a></div><div><p className="text-xs font-semibold uppercase text-muted-foreground">Por que agora?</p><p className="mt-1 text-sm">{item.why_this_lead}</p><div className="mt-2 flex flex-wrap gap-1">{(item.top_signals || []).slice(0, 3).map((signal, index) => <Badge variant="outline" key={`${signal.label}-${index}`}>+{signal.impact} {signal.label}</Badge>)}</div></div><div><p className="text-xs font-semibold uppercase text-muted-foreground">Oferta</p><p className="mt-1 text-sm font-medium">{item.recommended_products?.slice(0, 2).join(' + ')}</p><p className="mt-2 text-xs text-indigo-600">{item.recommended_plan}</p><p className="mt-2 text-xs text-muted-foreground">{item.primary_decision_maker ? `${item.primary_decision_maker.name} · ${item.primary_decision_maker.role || 'decisor'}` : 'Decisor ainda não identificado'}</p></div><div className="flex flex-col gap-2"><Button onClick={() => openDetail(item.cnpj)}>Ver inteligência <ArrowRight /></Button><Button variant="outline" onClick={() => addToCrm(item)}>Adicionar ao CRM</Button></div></CardContent></Card>; }

function OpportunityDetail({ item, close, addToCrm }: { item: Opportunity | null; close: () => void; addToCrm: (item: Opportunity) => void }) { return <Dialog open={Boolean(item)} onOpenChange={(open) => !open && close()}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">{item && <><DialogHeader><DialogTitle className="flex flex-wrap items-center gap-3"><Building2 className="text-indigo-600" /> {item.nome_fantasia || item.razao_social}<Badge className={CLASS_STYLE[item.classification]}>{item.tironi_score}/100 · {item.classification}</Badge></DialogTitle></DialogHeader><div className="grid gap-4 md:grid-cols-3"><Info label="Segmento" value={segmentLabel(item.segment_fit)} /><Info label="Plano recomendado" value={item.recommended_plan} /><Info label="Próxima ação" value={item.next_best_action} /></div><Section title="Por que abordar agora?"><p>{item.why_this_lead}</p><div className="mt-3 space-y-2">{(item.signals || []).map((signal, index) => <div key={signal.id || index} className="rounded-xl border p-3"><div className="flex justify-between gap-3"><strong>{signal.title}</strong><span className="text-sm font-semibold text-indigo-600">{Math.round((signal.confidence || 0) * 100)}%</span></div><p className="text-sm text-muted-foreground">{signal.description}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>Fonte: {signal.source_name}</span><span>Detectado: {formatDate(signal.observed_at)}</span>{signal.source_url && <a className="text-indigo-600" href={signal.source_url} target="_blank" rel="noreferrer">Ver evidência</a>}</div></div>)}</div></Section><div className="grid gap-4 md:grid-cols-2"><Section title="Tecnologias">{(item.technologies || []).length ? <div className="flex flex-wrap gap-2">{item.technologies?.map((tech) => <Badge variant="outline" key={`${tech.technology}-${tech.category}`}>{tech.technology}</Badge>)}</div> : <p className="text-sm text-muted-foreground">Nenhuma tecnologia confirmada.</p>}</Section><Section title="Pessoas e decisores">{(item.decision_makers || []).length ? item.decision_makers?.map((person) => <div key={`${person.name}-${person.role}`} className="mb-2 rounded-lg border p-3"><strong>{person.name}</strong><p className="text-sm text-muted-foreground">{person.role}</p><p className="text-xs">{person.email || person.phone || 'Contato não publicado'} · confiança {Math.round((person.confidence || 0) * 100)}%</p></div>) : <p className="text-sm text-muted-foreground">Nenhum decisor confirmado.</p>}</Section></div><Section title="O que vender?"><p className="font-medium">{item.recommended_products?.join(' · ')}</p></Section><Section title="Como abordar?"><p className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-950">{item.sales_approach}</p></Section><Section title="Histórico do score"><div className="flex flex-wrap gap-2">{(item.score_history || []).map((history) => <Badge variant="outline" key={history.calculated_at}>{history.tironi_score} · {formatDate(history.calculated_at)}</Badge>)}</div></Section><div className="flex justify-end gap-2"><Button variant="outline" onClick={close}>Fechar</Button><Button onClick={() => addToCrm(item)}>Adicionar ao CRM</Button></div></>}</DialogContent></Dialog>; }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-xl border p-4"><h3 className="mb-3 font-semibold">{title}</h3>{children}</section>; }
function Info({ label, value }: { label: string; value?: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value || 'Não informado'}</p></div>; }
function segmentLabel(value: string) { return ({ ecommerce_retail: 'E-commerce / varejo', automotive: 'Automotivo', distributor_wholesale: 'Distribuidor / atacado', franchise_multiunit: 'Rede / franquia', industry_b2b: 'Indústria B2B', high_ticket_services: 'Serviços high ticket', digital_company: 'Empresa digital', other: 'Outros' } as Record<string, string>)[value] || value; }
function formatDate(value?: string) { return value ? new Intl.DateTimeFormat('pt-BR').format(new Date(value)) : 'Não informado'; }
