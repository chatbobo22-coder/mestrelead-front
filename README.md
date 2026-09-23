# MestreLead

Painel de controle separado do `tironi-outreach` para criar modelos de e-mail, organizar campanhas, disparar ou agendar envios e acompanhar resultados.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis da Vercel

Configure no projeto `mestrelead-front` para Production, Preview e Development:

```env
OUTREACH_API_URL=https://tironi-outreach.vercel.app
OUTREACH_API_KEY=
INJECTOR_API_URL=https://prospect-etl-inejctor.vercel.app
INJECTOR_API_KEY=
```

`OUTREACH_API_KEY` deve ter o mesmo valor de `API_KEY` no projeto do backend. As duas variáveis são utilizadas apenas pelas rotas do servidor e não são expostas ao navegador.

`INJECTOR_API_KEY` deve ter o mesmo valor de `API_KEY` configurado no projeto
`prospect-etl-inejctor`. O painel usa essa conexão de servidor para iniciar,
acompanhar e abortar cargas sem expor a chave no navegador.

No projeto do Injector, `DATABASE_STORAGE_LIMIT_MB` é opcional. Quando
informado, o MestreLead também mostra a porcentagem consumida do limite de
armazenamento; sem ele, o tamanho real do banco e de cada área continua sendo
exibido.

## Métricas do SendPulse

O endpoint de eventos é `/api/webhooks/sendpulse`. Ele encaminha os eventos ao `tironi-outreach`, onde entregas, aberturas, cliques e falhas são persistidos.

O MestreLead evita registrar duas vezes o mesmo evento e agrega entregas, aberturas, cliques, respostas e falhas por campanha, assunto e modelo.
