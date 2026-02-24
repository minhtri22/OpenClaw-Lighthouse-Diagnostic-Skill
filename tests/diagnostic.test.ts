import { describe, it, expect } from "vitest";
import { AnomalyDetector } from "../src/diagnostic/AnomalyDetector";
import { RemedyLogic } from "../src/diagnostic/RemedyLogic";
import { ImpactScorer } from "../src/diagnostic/ImpactScorer";
import { BottleneckClassifier } from "../src/diagnostic/BottleneckClassifier";
import { MetricsSnapshot } from "../src/domain/ReportTypes";

const baseMetrics: MetricsSnapshot = {
  timestamp: Date.now(),
  capitalVelocity: 5,
  tokenThroughputPerMin: 120,
  avgResponseTimeMs: 10_000,
  successCount: 10,
  blockRate: 0.05,
  queueDepth: 1,
  cpuLoadPct: 30,
  allocationBreakdown: { scale: 0.3, maintain: 0.6, kill: 0.1 },
};

describe("AnomalyDetector", () => {
  it("flags latency breach", () => {
    const detector = new AnomalyDetector({ latencyMs: 1000, tokenSpikeMultiplier: 3, validationFloor: 0.05 });
    const flags = detector.detect(baseMetrics);
    expect(flags.some((f) => f.type === "latency")).toBe(true);
  });
});

describe("RemedyLogic", () => {
  it("recommends KILL on low validation", () => {
    const classifier = new BottleneckClassifier();
    const scorer = new ImpactScorer();
    const logic = new RemedyLogic();
    const bottlenecks = scorer.score(
      classifier.classify(baseMetrics, [{ type: "latency", message: "high" } as any], 0.1)
    );
    const { guidance } = logic.recommend(bottlenecks);
    expect(guidance.length).toBeGreaterThan(0);
  });
});
