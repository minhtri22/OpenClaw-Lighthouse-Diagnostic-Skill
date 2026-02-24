import { describe, it, expect } from "vitest";
import { MarkdownGenerator } from "../src/exporters/MarkdownGenerator";
import { NotebookLMPack } from "../src/exporters/NotebookLMPack";
import { DiagnosticReport, ResearchPack } from "../src/domain/ReportTypes";
import { promises as fs } from "fs";
import path from "path";

describe("MarkdownGenerator", () => {
  it("renders diagnostic report markdown", () => {
    const gen = new MarkdownGenerator();
    const report: DiagnosticReport = {
      metrics: {
        timestamp: Date.now(),
        capitalVelocity: 1,
        tokenThroughputPerMin: 50,
        avgResponseTimeMs: 1000,
        successCount: 5,
        blockRate: 0.1,
        queueDepth: 2,
        cpuLoadPct: 40,
        allocationBreakdown: { scale: 1, maintain: 2, kill: 0 },
      },
      anomalies: [],
      recommendations: [{ action: "MAINTAIN", reason: "Within thresholds" }],
    };
    const md = gen.diagnostic(report);
    expect(md).toContain("Lighthouse Diagnostic Report");
  });
});

describe("NotebookLMPack", () => {
  it("exports research pack to markdown file", async () => {
    const exporter = new NotebookLMPack(".tmp-reports");
    const pack: ResearchPack = {
      title: "Test Pack",
      blueprint: "bp",
      prd: "prd",
      pains: ["slow", "cost"],
      productDNA: { key: "value" },
    };
    const filePath = await exporter.export(pack);
    const exists = await fs.stat(path.resolve(filePath));
    expect(exists.isFile()).toBe(true);
    await fs.rm(".tmp-reports", { recursive: true, force: true });
  });
});
