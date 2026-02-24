import { DiagnosticReport, ResearchPack } from "../domain/ReportTypes";

export class MarkdownGenerator {
  diagnostic(report: DiagnosticReport): string {
    const lines: string[] = [];
    lines.push(`# Lighthouse Diagnostic Report`);
    lines.push(`Generated: ${new Date(report.metrics.timestamp).toISOString()}`);
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
    lines.push("## Recommendations");
    for (const r of report.recommendations) {
      lines.push(`- ${r.action}: ${r.reason}`);
    }
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
