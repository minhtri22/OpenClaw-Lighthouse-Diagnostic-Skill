export interface MetricsSnapshot {
  timestamp: number;
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

export interface AnomalyFlag {
  type: "token_spike" | "latency" | "validation_low";
  message: string;
  details?: Record<string, unknown>;
}

export interface RemedyRecommendation {
  action: "SCALE" | "MAINTAIN" | "KILL";
  reason: string;
}

export interface ResearchPack {
  title: string;
  blueprint: string;
  prd: string;
  pains: string[];
  productDNA: Record<string, unknown>;
}

export interface DiagnosticReport {
  metrics: MetricsSnapshot;
  anomalies: AnomalyFlag[];
  recommendations: RemedyRecommendation[];
}
