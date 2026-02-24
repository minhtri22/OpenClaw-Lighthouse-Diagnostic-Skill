import { MetricsSnapshot, AnomalyFlag } from "../domain/ReportTypes";

export interface AnomalyThresholds {
  latencyMs: number;
  tokenSpikeMultiplier: number;
  validationFloor: number;
}

export class AnomalyDetector {
  constructor(private readonly thresholds: AnomalyThresholds) {}

  detect(metrics: MetricsSnapshot, validationScore?: number): AnomalyFlag[] {
    const flags: AnomalyFlag[] = [];
    if (metrics.avgResponseTimeMs > this.thresholds.latencyMs) {
      flags.push({
        type: "latency",
        message: `Latency high: ${metrics.avgResponseTimeMs}ms > ${this.thresholds.latencyMs}ms`,
      });
    }
    if (metrics.tokenThroughputPerMin > 100 * this.thresholds.tokenSpikeMultiplier) {
      flags.push({
        type: "token_spike",
        message: "Token spike detected",
      });
    }
    if (validationScore !== undefined && validationScore < this.thresholds.validationFloor) {
      flags.push({
        type: "validation_low",
        message: `Validation score ${validationScore} below ${this.thresholds.validationFloor}`,
      });
    }
    return flags;
  }
}
