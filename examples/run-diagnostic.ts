import { createLighthouse } from "../src";

async function main() {
  const lighthouse = createLighthouse();

  const metrics = lighthouse.metrics.collect({
    capitalVelocity: 12,
    tokenThroughputPerMin: 300,
    avgResponseTimeMs: 1500,
    successCount: 42,
    blockRate: 0.08,
    queueDepth: 5,
    cpuLoadPct: 55,
    allocationBreakdown: { scale: 0.4, maintain: 0.5, kill: 0.1 },
  });

  const anomalies = lighthouse.anomalyDetector.detect(metrics, 0.07);
  const recs = lighthouse.remedy.recommend(0.07, anomalies);

  const report = { metrics, anomalies, recommendations: recs };
  const md = lighthouse.md.diagnostic(report);

  console.log(md);
}

main().catch((err) => {
  console.error("Diagnostic failed", err);
  process.exit(1);
});
