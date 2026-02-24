# OpenClaw Lighthouse Diagnostic Skill

Deterministic diagnostic reporting engine for LLM runtime systems.

Lighthouse analyzes aggregated runtime metrics and produces a ranked, structured diagnostic report.

It helps answer:

- `Why did latency increase?`

- `Why is cost rising?`

- `Which bottlenecks have the highest impact?`

- `What should we investigate first?`

This is post-execution analytics only.
It does not block traffic, enforce budgets, or mutate runtime behavior.

What Problem This Solves

When operating LLM systems in production, teams face:

- `Latency spikes without clear root cause`

- `Token throughput instability`

- `Rising cost without structured explanation`

- `CPU and queue saturation`

- `Too many metrics, no prioritization`

Dashboards show data.
They do not rank problems.

Lighthouse converts aggregated metrics into:

Detected anomalies

Classified bottlenecks

Impact scores

Top-3 prioritized recommendations

Structured guidance

Self-debug plan

Exportable Markdown report

## Quick Start
- `npm install`
- `npm run build`
- `npm run test`
- `npm run example` (prints a sample diagnostic report)

```ts
import { createLighthouse } from "openclaw-lighthouse-diagnostic-skill";

const lh = createLighthouse();
const metrics = lh.metrics.collect({
  capitalVelocity: 10,
  tokenThroughputPerMin: 200,
  avgResponseTimeMs: 800,
  successCount: 20,
  blockRate: 0.05,
  queueDepth: 3,
  cpuLoadPct: 45,
  allocationBreakdown: { scale: 0.2, maintain: 0.7, kill: 0.1 },
});

const anomalies = lh.anomalyDetector.detect(metrics, 0.07);
const recs = lh.remedy.recommend(0.07, anomalies);
```

## Log Ingestion Contract
Consumes JSONL logs shaped as:
`{ requestId, model, promptTokens, completionTokens, totalTokens, cost, latencyMs, environment, blocked, blockReason, timestamp }`
Feed these to your own pipeline, then pass aggregates to Lighthouse analyzers. Lighthouse will not mutate or block traffic.

## How to Read Latency & Bottlenecks
- `avgResponseTimeMs` > 30s: Local LLM or hardware queue likely congested; inspect GPU/queue first.
- `tokenThroughputPerMin` spike: possible runaway loop; pair with cost/ops logs to confirm.
- `queueDepth` and `cpuLoadPct` give immediate visibility on saturation.

## Research Pack for NotebookLM
- Use `NotebookLMPack.export` to generate Markdown in `/reports`.
- Feed the file into NotebookLM to ask for product comparisons or strategy ideas.
- Packs include Blueprint, PRD, pains, and Product DNA (structured JSON block).

## Error Codes & Remedies
- Latency breach → Recommend `MAINTAIN` with note to inspect GPU/queue.
- Token spike → Recommend `KILL` (circuit breaker).
- `validationScore < 0.05` → Recommend `KILL` with reason.
- No anomalies → `MAINTAIN`.

## Folder Layout
- `src/monitoring`: `MetricsCollector`, `TokenWatcher`
- `src/diagnostic`: `AnomalyDetector`, `RemedyLogic`
- `src/exporters`: `MarkdownGenerator`, `NotebookLMPack`
- `src/domain`: report types
- `reports/`: generated outputs (local-first)
- `tests/`: adversarial/unit coverage for metrics, anomaly, exporters

## Constraints
- Deterministic only: no AI heuristics for safety decisions.
- Local-first: outputs to JSON/Markdown under `/reports`.
- Read-only to core systems: does not mutate scoring/budget, does not enforce or block requests.
