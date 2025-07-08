import fs from "fs";

export function logSignal(userId, symbol, entry, tp, sl, tf) {
  const record = {
    time: new Date().toISOString(),
    user: userId,
    symbol,
    tf,
    entry,
    tp,
    sl
  };
  const path = "logs/signals.json";

  let log = [];
  if (fs.existsSync(path)) {
    log = JSON.parse(fs.readFileSync(path));
  }
  log.push(record);
  fs.writeFileSync(path, JSON.stringify(log, null, 2));
}
