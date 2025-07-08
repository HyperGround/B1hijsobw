import axios from "axios";

export async function fetchHistoricalCloses(symbol, tf, limit = 500) {
  const res = await axios.get(\`https://api.binance.com/api/v3/klines?symbol=\${symbol}&interval=\${tf}&limit=\${limit}\`);
  return res.data.map(c => parseFloat(c[4]));
}
