import { describe, it, expect } from "vitest";
import { MetricsCollector } from "../src/monitoring/MetricsCollector";
import { TokenWatcher } from "../src/monitoring/TokenWatcher";

describe("MetricsCollector", () => {
  it("collects metrics snapshot with timestamp", () => {
    const collector = new MetricsCollector();
    const snap = collector.collect({
      capitalVelocity: 10,
      tokenThroughputPerMin: 120,
      avgResponseTimeMs: 500,
      successCount: 5,
      blockRate: 0.1,
      queueDepth: 2,
      cpuLoadPct: 40,
      allocationBreakdown: { scale: 1, maintain: 2, kill: 0 },
    });
    expect(snap.timestamp).toBeGreaterThan(0);
    expect(snap.capitalVelocity).toBe(10);
  });
});

describe("TokenWatcher", () => {
  it("detects spike over baseline", () => {
    const watcher = new TokenWatcher();
    const spike = watcher.detectSpike({ windowMs: 60_000, tokens: 400 });
    expect(spike).toBe(true);
  });
});
