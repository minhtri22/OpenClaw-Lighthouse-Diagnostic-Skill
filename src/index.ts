import { MetricsCollector } from "./monitoring/MetricsCollector";
import { TokenWatcher } from "./monitoring/TokenWatcher";
import { AnomalyDetector } from "./diagnostic/AnomalyDetector";
import { RemedyLogic } from "./diagnostic/RemedyLogic";
import { MarkdownGenerator } from "./exporters/MarkdownGenerator";
import { NotebookLMPack } from "./exporters/NotebookLMPack";
import { DiagnosticReport, ResearchPack, MetricsSnapshot } from "./domain/ReportTypes";

export {
  MetricsCollector,
  TokenWatcher,
  AnomalyDetector,
  RemedyLogic,
  MarkdownGenerator,
  NotebookLMPack,
  DiagnosticReport,
  ResearchPack,
  MetricsSnapshot,
};

export function createLighthouse() {
  const metrics = new MetricsCollector();
  const tokenWatcher = new TokenWatcher();
  const anomalyDetector = new AnomalyDetector({
    latencyMs: 30_000,
    tokenSpikeMultiplier: 3,
    validationFloor: 0.05,
  });
  const remedy = new RemedyLogic();
  const md = new MarkdownGenerator();
  const exporter = new NotebookLMPack("reports");

  return { metrics, tokenWatcher, anomalyDetector, remedy, md, exporter };
}
