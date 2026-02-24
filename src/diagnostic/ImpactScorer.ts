import { Bottleneck, ImpactInput } from "../domain/ReportTypes";

export class ImpactScorer {
  score(bottlenecks: Bottleneck[]): Bottleneck[] {
    return bottlenecks.map((b) => ({
      ...b,
      impactScore: this.compute({
        costImpact: b.costImpact,
        latencyImpact: b.latencyImpact,
        frequency: b.frequency,
      }),
    }));
  }

  private compute(input: ImpactInput): number {
    const normCost = normalize(input.costImpact);
    const normLatency = normalize(input.latencyImpact);
    const freq = normalize(input.frequency);
    return clamp01(normCost * 0.4 + normLatency * 0.3 + freq * 0.3);
  }
}

function normalize(val: number): number {
  if (!isFinite(val)) return 0;
  const abs = Math.abs(val);
  const scaled = abs / (abs + 1); // 0..1 saturation
  return scaled;
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
