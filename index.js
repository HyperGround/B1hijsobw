// scalping-signal-bot/index.js
import Bot from "bots.business";
import axios from "axios";
import { config, pairs, tfOptions } from "./config.js";
import { getSignal } from "./strategy/scalpingStrategy.js";
import { sendProfitAlert } from "./services/alerts.js";

const bot = new Bot();
let userState = {};

bot.on("start", async (msg) => {
  const opts = pairs.map(p => [{ label: p, callback_data: `pair_${p}` }]);
  await bot.sendInlineKeyboard(msg.chat.id, `👋 سڵاو، کەیسی شیکاری دیاری بکە:`, opts);
});

bot.onCallbackQuery(/^pair_(.*)/, async (query, match) => {
  const pair = match[1];
  userState[query.from.id] = { pair };

  const tfOpts = tfOptions.map(tf => [{ label: tf, callback_data: `tf_${tf}` }]);
  await bot.sendInlineKeyboard(query.message.chat.id, `⏱ تایمفرەیم دیاری بکە:`, tfOpts);
});

bot.onCallbackQuery(/^tf_(.*)/, async (query, match) => {
  const tf = match[1];
  const user = userState[query.from.id];
  if (!user) return;

  user.tf = tf;
  bot.sendMessage(query.message.chat.id, `🔄 بەدواداچوون بۆ سیگناڵی بەهێز بۆ ${user.pair} لە تایم ${user.tf}`);

  startMonitoring(query.from.id, user.pair, user.tf);
});

async function startMonitoring(userId, symbol, tf) {
  const interval = 60; // seconds

  setInterval(async () => {
    try {
      const closes = await fetchCloses(symbol, tf);
      const signal = getSignal(closes);

      if (signal) {
        const entry = closes[closes.length - 1];
        const sl = entry - 0.0020;
        const tp = entry + (entry - sl) * 3;

        bot.sendMessage(userId, `✅ Entry: ${entry}
📉 SL: ${sl.toFixed(4)}
📈 TP: ${tp.toFixed(4)}
🪙 ${symbol}`);

        watchProfit(userId, symbol, entry, tp, sl);
      }
    } catch (err) {
      console.error("Signal error:", err.message);
    }
  }, interval * 1000);
}

async function fetchCloses(symbol, tf) {
  const res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${tf}&limit=100`);
  return res.data.map(c => parseFloat(c[4]));
}

function watchProfit(userId, symbol, entry, tp, sl) {
  const check = setInterval(async () => {
    try {
      const price = await getCurrentPrice(symbol);
      const gainRatio = (price - entry) / (entry - sl);

      if (gainRatio >= 2) {
        sendProfitAlert(bot, userId, symbol, entry, price);
        clearInterval(check);
      }
    } catch {}
  }, 10000);
}

async function getCurrentPrice(symbol) {
  const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  return parseFloat(res.data.price);
}
