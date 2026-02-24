import { Bottleneck, Guidance, RemedyRecommendation } from "../domain/ReportTypes";
import { GuidanceEngine } from "./GuidanceEngine";

export class RemedyLogic {
  private guidance = new GuidanceEngine();

  recommend(bottlenecks: Bottleneck[]): { recs: RemedyRecommendation[]; guidance: Guidance[] } {
    const sorted = [...bottlenecks].sort((a, b) => b.impactScore - a.impactScore);
    const recs: RemedyRecommendation[] = sorted.slice(0, 3).map((b) => ({
      action: "MAINTAIN",
      reason: `Focus on ${b.type}: ${b.explanation}`,
    }));
    const guidance = sorted.slice(0, 3).map((b) => this.guidance.generate(b, b.costImpact, b.latencyImpact));
    return { recs, guidance };
  }
}
