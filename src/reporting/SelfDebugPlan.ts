import { SevenDayPlan } from "../domain/ReportTypes";

export function buildSevenDayPlan(): SevenDayPlan[] {
  return [
    { day: 1, focus: "Trim prompts", steps: ["Audit system prompts", "Remove redundant context", "Cap max_tokens"] },
    { day: 2, focus: "Model selection", steps: ["Route low-complexity to cheaper model", "Set model mapping"] },
    { day: 3, focus: "Caching", steps: ["Enable semantic cache", "Deduplicate similar prompts"] },
    { day: 4, focus: "Retries & circuit", steps: ["Cap retries", "Add circuit breaker for spikes"] },
    { day: 5, focus: "Load test", steps: ["Replay logs", "Measure p95 latency", "Record token/latency curves"] },
    { day: 6, focus: "Re-run Lighthouse", steps: ["Generate new report", "Compare impact scores"] },
    { day: 7, focus: "Validate savings", steps: ["Track cost delta", "Document changes", "Set monitoring alerts"] },
  ];
}
