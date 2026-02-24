import { Bottleneck, BottleneckType, MetricsSnapshot, AnomalyFlag } from "../domain/ReportTypes";

export class BottleneckClassifier {
  classify(metrics: MetricsSnapshot, anomalies: AnomalyFlag[], retryRate: number): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    const push = (
      type: BottleneckType,
      severity: number,
      costImpact: number,
      latencyImpact: number,
      frequency: number,
      explanation: string,
      evidence: Record<string, unknown>,
      suggestedFixes: string[]
    ) => {
      bottlenecks.push({
        type,
        severity: clamp01(severity),
        impactScore: 0, // filled later by impact scorer
        costImpact,
        latencyImpact,
        frequency,
        explanation,
        evidence,
        suggestedFixes,
      });
    };

    const tokenSpike = anomalies.find((a) => a.type === "token_spike");
    if (tokenSpike) {
      push(
        "TOKEN_INFLATION",
        0.7,
        metrics.tokenThroughputPerMin * 0.01,
        metrics.avgResponseTimeMs * 0.1,
        0.6,
        "Token usage spiked relative to baseline.",
        { tokenThroughputPerMin: metrics.tokenThroughputPerMin },
        ["Trim prompts", "Cap max_tokens", "Enable response compression"]
      );
    }

    if (metrics.avgResponseTimeMs > 30_000) {
      push(
        "LATENCY_SPIKE",
        0.8,
        0,
        metrics.avgResponseTimeMs,
        0.8,
        "Average response time exceeds 30s threshold.",
        { avgResponseTimeMs: metrics.avgResponseTimeMs },
        ["Inspect GPU/queue depth", "Reduce concurrent requests", "Prefer streaming with smaller chunks"]
      );
    }

    if (retryRate > 0.2) {
      push(
        "RETRY_STORM",
        0.6,
        metrics.tokenThroughputPerMin * 0.05,
        metrics.avgResponseTimeMs * 0.2,
        retryRate,
        "High retry rate indicates instability.",
        { retryRate },
        ["Lower retries", "Introduce circuit breaker", "Cache successful responses"]
      );
    }

    if (metrics.capitalVelocity > 0) {
      push(
        "COST_INEFFICIENCY",
        0.5,
        metrics.capitalVelocity,
        0,
        0.4,
        "Capital velocity is elevated; model/cost mix may be inefficient.",
        { capitalVelocity: metrics.capitalVelocity },
        ["Switch to cheaper model for low complexity tasks", "Reduce prompt size", "Batch small requests"]
      );
    }

    return bottlenecks;
  }
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
