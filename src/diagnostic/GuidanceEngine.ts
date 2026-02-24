import { Bottleneck, Guidance } from "../domain/ReportTypes";

export class GuidanceEngine {
  generate(bottleneck: Bottleneck, estimatedSavingUSD = 0, estimatedLatencyMs = 0): Guidance {
    const tokenReduction = 30;
    return {
      explanation: bottleneck.explanation,
      simulation: {
        tokenReductionPercent: tokenReduction,
        estimatedCostSavingUSD: estimatedSavingUSD,
        estimatedLatencyReductionMs: estimatedLatencyMs,
      },
      aiQuestions: [
        "Analyze the attached token breakdown and suggest trimming strategy.",
        "Refactor my system prompt to reduce token size by 30%.",
        "Design caching for repeated similar requests.",
      ],
      implementationChecklist: [
        "Trim system prompt",
        "Cap max_tokens",
        "Add prompt compression or templating",
        "Cache low-variance requests",
      ],
    };
  }
}
