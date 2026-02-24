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

export type BottleneckType =
  | "TOKEN_INFLATION"
  | "RETRY_STORM"
  | "MODEL_SLOWNESS"
  | "LATENCY_SPIKE"
  | "COST_INEFFICIENCY";

export interface Bottleneck {
  type: BottleneckType;
  severity: number; // 0-1
  impactScore: number; // 0-1
  costImpact: number;
  latencyImpact: number;
  frequency: number;
  explanation: string;
  evidence: Record<string, unknown>;
  suggestedFixes: string[];
}

export interface ImpactInput {
  costImpact: number;
  latencyImpact: number;
  frequency: number;
}

export interface Guidance {
  explanation: string;
  simulation: {
    tokenReductionPercent: number;
    estimatedCostSavingUSD: number;
    estimatedLatencyReductionMs: number;
  };
  aiQuestions: string[];
  implementationChecklist: string[];
}

export interface SevenDayPlan {
  day: number;
  focus: string;
  steps: string[];
}
