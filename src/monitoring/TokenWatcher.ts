export interface TokenStat {
  windowMs: number;
  tokens: number;
}

export class TokenWatcher {
  detectSpike(stats: TokenStat, thresholdMultiplier = 3): boolean {
    const rate = stats.tokens / (stats.windowMs / 60000); // tokens per minute
    const baselinePerMin = 100; // configurable baseline
    return rate > baselinePerMin * thresholdMultiplier;
  }
}
