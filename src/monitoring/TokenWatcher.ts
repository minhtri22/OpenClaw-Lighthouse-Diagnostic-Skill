export interface TokenStat {
  windowMs: number;
  tokens: number;
}

export class TokenWatcher {
  detectSpike(stats: TokenStat, baselinePerMin = 100, thresholdMultiplier = 3): boolean {
    const rate = stats.tokens / (stats.windowMs / 60000); // tokens per minute
    return rate > baselinePerMin * thresholdMultiplier;
  }
}
