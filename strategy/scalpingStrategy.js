import { EMA, RSI } from "technicalindicators";

export function getSignal(closes) {
  const ema20 = EMA.calculate({ period: 20, values: closes });
  const ema50 = EMA.calculate({ period: 50, values: closes });
  const rsi = RSI.calculate({ period: 14, values: closes });

  const latestEMA20 = ema20[ema20.length - 1];
  const latestEMA50 = ema50[ema50.length - 1];
  const latestRSI = rsi[rsi.length - 1];

  return latestEMA20 > latestEMA50 && latestRSI > 40 && latestRSI < 70;
}