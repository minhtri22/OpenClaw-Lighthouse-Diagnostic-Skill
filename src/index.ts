import { MetricsCollector } from "./monitoring/MetricsCollector";
import { TokenWatcher } from "./monitoring/TokenWatcher";
import { AnomalyDetector } from "./diagnostic/AnomalyDetector";
import { BottleneckClassifier } from "./diagnostic/BottleneckClassifier";
import { ImpactScorer } from "./diagnostic/ImpactScorer";
import { RemedyLogic } from "./diagnostic/RemedyLogic";
import { MarkdownGenerator } from "./exporters/MarkdownGenerator";
import { NotebookLMPack } from "./exporters/NotebookLMPack";
import { DiagnosticReport, ResearchPack, MetricsSnapshot, Bottleneck } from "./domain/ReportTypes";
import { buildSevenDayPlan } from "./reporting/SelfDebugPlan";

export {
  MetricsCollector,
  TokenWatcher,
  AnomalyDetector,
  BottleneckClassifier,
  ImpactScorer,
  RemedyLogic,
  MarkdownGenerator,
  NotebookLMPack,
  DiagnosticReport,
  ResearchPack,
  MetricsSnapshot,
  Bottleneck,
  buildSevenDayPlan,
};

export function createLighthouse() {
  const metrics = new MetricsCollector();
  const tokenWatcher = new TokenWatcher();
  const anomalyDetector = new AnomalyDetector({
    latencyMs: 30_000,
    tokenSpikeMultiplier: 3,
    validationFloor: 0.05,
  });
  const classifier = new BottleneckClassifier();
  const scorer = new ImpactScorer();
  const remedy = new RemedyLogic();
  const md = new MarkdownGenerator();
  const exporter = new NotebookLMPack("reports");

  return { metrics, tokenWatcher, anomalyDetector, classifier, scorer, remedy, md, exporter, planBuilder: buildSevenDayPlan };
}
