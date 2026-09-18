# MestreLead

Painel de controle separado do `tironi-outreach` para criar modelos de e-mail, organizar campanhas, disparar ou agendar envios e acompanhar resultados.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Métricas do SendPulse

O endpoint de eventos é `/api/webhooks/sendpulse`. Configure `SENDPULSE_WEBHOOK_SECRET` e cadastre no SendPulse a URL publicada com `?secret=SEU_SEGREDO` para os eventos de entrega, abertura, clique e falha.

O MestreLead evita registrar duas vezes o mesmo evento e agrega entregas, aberturas, cliques, respostas e falhas por campanha, assunto e modelo.
