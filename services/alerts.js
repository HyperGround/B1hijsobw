export function sendProfitAlert(bot, userId, symbol, entry, currentPrice) {
  const gain = (currentPrice - entry).toFixed(4);
  bot.sendMessage(
    userId,
    `⚠️ سڵاو، بەڕێز @
مامەڵەکەت گەیشتووە بە 1:2 لە ${symbol}
Entry: ${entry}
Price: ${currentPrice}
Gain: $${gain} 📈

🔔 تکایە چارەسەرێک بگرە: دابخە یان SL دابنێ لە 2 پیپ خوار نرخی ئێستا`
  );
}