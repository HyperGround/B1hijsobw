import fs from "fs";
import { getSignal } from "../strategy/scalpingStrategy.js";
import { fetchHistoricalCloses } from "../services/marketData.js";

async function runBacktest(symbol = "ETHUSD", tf = "1h") {
  const closes = await fetchHistoricalCloses(symbol, tf, 500);
  let wins = 0, losses = 0, total = 0;

  for (let i = 50; i < closes.length - 10; i++) {
    const window = closes.slice(i - 50, i);
    const signal = getSignal(window);

    if (signal) {
      const entry = closes[i];
      const sl = entry - 0.002;
      const tp = entry + (entry - sl) * 3;

      for (let j = 1; j <= 10; j++) {
        const nextPrice = closes[i + j];
        if (nextPrice >= tp) {
          wins++;
          break;
        }
        if (nextPrice <= sl) {
          losses++;
          break;
        }
      }
      total++;
    }
  }

  const winrate = total > 0 ? ((wins / total) * 100).toFixed(2) : "0";
  fs.writeFileSync("results.json", JSON.stringify({ wins, losses, total, winrate }, null, 2));
  console.log("✅ Backtest finished. Winrate:", winrate + "%");
}

runBacktest();
