import { Bottleneck, DiagnosticReport, Guidance, ResearchPack, SevenDayPlan } from "../domain/ReportTypes";

export class MarkdownGenerator {
  diagnostic(report: DiagnosticReport, bottlenecks: Bottleneck[], guidance: Guidance[], plan: SevenDayPlan[]): string {
    const lines: string[] = [];
    lines.push(`# Lighthouse Diagnostic Report`);
    lines.push(`Generated: ${new Date(report.metrics.timestamp).toISOString()}`);
    lines.push("");
    lines.push("## Executive Summary");
    const top = bottlenecks.slice(0, 3);
    lines.push(`Top ${top.length} bottlenecks by impact: ${top.map((b) => b.type).join(", ") || "None"}`);
    lines.push("");
    lines.push("## Metrics");
    lines.push(`- Capital Velocity: ${report.metrics.capitalVelocity}`);
    lines.push(`- Token Throughput/min: ${report.metrics.tokenThroughputPerMin}`);
    lines.push(`- Avg Response Time (ms): ${report.metrics.avgResponseTimeMs}`);
    lines.push(`- Success Count: ${report.metrics.successCount}`);
    lines.push(`- Block Rate: ${report.metrics.blockRate}`);
    lines.push(`- Queue Depth: ${report.metrics.queueDepth}`);
    lines.push(`- CPU Load %: ${report.metrics.cpuLoadPct}`);
    lines.push(
      `- Allocation Breakdown: SCALE ${report.metrics.allocationBreakdown.scale}, MAINTAIN ${report.metrics.allocationBreakdown.maintain}, KILL ${report.metrics.allocationBreakdown.kill}`
    );
    lines.push("");
    lines.push("## Anomalies");
    if (report.anomalies.length === 0) {
      lines.push("- None");
    } else {
      for (const a of report.anomalies) {
        lines.push(`- ${a.type}: ${a.message}`);
      }
    }
    lines.push("");
    lines.push("## Bottlenecks (Ranked)");
    top.forEach((b, idx) => {
      lines.push(`### ${idx + 1}. ${b.type}`);
      lines.push(`- Impact Score: ${b.impactScore.toFixed(2)}`);
      lines.push(`- Severity: ${b.severity}`);
      lines.push(`- Cost Impact: ${b.costImpact}`);
      lines.push(`- Latency Impact: ${b.latencyImpact}`);
      lines.push(`- Frequency: ${b.frequency}`);
      lines.push(`- Explanation: ${b.explanation}`);
      lines.push(`- Suggested Fixes: ${b.suggestedFixes.join("; ")}`);
      lines.push("");
    });
    lines.push("## Recommendations");
    report.recommendations.forEach((r) => lines.push(`- ${r.action}: ${r.reason}`));
    lines.push("");
    lines.push("## AI Guidance");
    guidance.forEach((g, idx) => {
      lines.push(`### Guidance ${idx + 1}`);
      lines.push(`- Explanation: ${g.explanation}`);
      lines.push(
        `- Simulation: token -${g.simulation.tokenReductionPercent}%, cost save ~$${g.simulation.estimatedCostSavingUSD}, latency -${g.simulation.estimatedLatencyReductionMs}ms`
      );
      lines.push(`- AI Questions: ${g.aiQuestions.join(" | ")}`);
      lines.push(`- Checklist: ${g.implementationChecklist.join(" | ")}`);
      lines.push("");
    });
    lines.push("## 7-Day Fix Plan");
    plan.forEach((p) => {
      lines.push(`Day ${p.day}: ${p.focus}`);
      lines.push(`Steps: ${p.steps.join("; ")}`);
    });
    return lines.join("\n");
  }

  researchPack(pack: ResearchPack): string {
    const lines: string[] = [];
    lines.push(`# ${pack.title}`);
    lines.push("");
    lines.push("## Blueprint");
    lines.push(pack.blueprint);
    lines.push("");
    lines.push("## PRD");
    lines.push(pack.prd);
    lines.push("");
    lines.push("## Pains");
    for (const pain of pack.pains) {
      lines.push(`- ${pain}`);
    }
    lines.push("");
    lines.push("## Product DNA");
    lines.push("```json");
    lines.push(JSON.stringify(pack.productDNA, null, 2));
    lines.push("```");
    return lines.join("\n");
  }
}
