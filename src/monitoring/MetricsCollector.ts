import { MetricsSnapshot } from "../domain/ReportTypes";

export interface MetricsInput {
  capitalVelocity: number;
  tokenThroughputPerMin: number;
  avgResponseTimeMs: number;
  successCount: number;
  blockRate: number;
  queueDepth: number;
  cpuLoadPct: number;
  allocationBreakdown: {
    scale: number;
    maintain: number;
    kill: number;
  };
}

export class MetricsCollector {
  collect(input: MetricsInput): MetricsSnapshot {
    return {
      timestamp: Date.now(),
      ...input,
    };
  }
}
