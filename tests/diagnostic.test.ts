import { describe, it, expect } from "vitest";
import { AnomalyDetector } from "../src/diagnostic/AnomalyDetector";
import { RemedyLogic } from "../src/diagnostic/RemedyLogic";
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
    const logic = new RemedyLogic();
    const recs = logic.recommend(0.01, []);
    expect(recs.some((r) => r.action === "KILL")).toBe(true);
  });
});
