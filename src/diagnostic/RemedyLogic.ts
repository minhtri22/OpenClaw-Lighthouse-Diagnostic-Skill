import { AnomalyFlag, RemedyRecommendation } from "../domain/ReportTypes";

export class RemedyLogic {
  recommend(validationScore: number | undefined, anomalies: AnomalyFlag[]): RemedyRecommendation[] {
    const recs: RemedyRecommendation[] = [];

    const hasLatency = anomalies.some((a) => a.type === "latency");
    const hasTokenSpike = anomalies.some((a) => a.type === "token_spike");
    const validationLow = validationScore !== undefined && validationScore < 0.05;

    if (validationLow) {
      recs.push({ action: "KILL", reason: "validationScore below 0.05" });
    }

    if (hasTokenSpike) {
      recs.push({ action: "KILL", reason: "Token spike detected; trigger circuit breaker" });
    }

    if (hasLatency && !validationLow) {
      recs.push({ action: "MAINTAIN", reason: "High latency; inspect GPU/queue before scaling" });
    }

    if (!recs.length) {
      recs.push({ action: "MAINTAIN", reason: "Within thresholds" });
    }

    return recs;
  }
}
