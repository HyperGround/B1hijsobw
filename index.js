// index.js for Bots.Business
bbLib.onCommand("start", (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [{ text: "XAUUSD", callback_data: "pair_XAUUSD" }],
      [{ text: "EURUSD", callback_data: "pair_EURUSD" }],
      [{ text: "ETHUSD", callback_data: "pair_ETHUSD" }],
      [{ text: "JPYUSD", callback_data: "pair_JPYUSD" }]
    ]
  };

  bbLib.sendMessage(ctx.chat.id, "👋 سڵاو، کەیسی شیکاری دیاری بکە:", {
    reply_markup: keyboard
  });
});

bbLib.onCallback("pair_XAUUSD", (ctx) => handlePair(ctx, "XAUUSD"));
bbLib.onCallback("pair_EURUSD", (ctx) => handlePair(ctx, "EURUSD"));
bbLib.onCallback("pair_ETHUSD", (ctx) => handlePair(ctx, "ETHUSD"));
bbLib.onCallback("pair_JPYUSD", (ctx) => handlePair(ctx, "JPYUSD"));

function handlePair(ctx, pair) {
  const keyboard = {
    inline_keyboard: [
      [{ text: "1m", callback_data: `tf_${pair}_1m` }],
      [{ text: "5m", callback_data: `tf_${pair}_5m` }],
      [{ text: "15m", callback_data: `tf_${pair}_15m` }],
      [{ text: "1h", callback_data: `tf_${pair}_1h` }],
      [{ text: "4h", callback_data: `tf_${pair}_4h` }],
      [{ text: "1d", callback_data: `tf_${pair}_1d` }],
      [{ text: "1w", callback_data: `tf_${pair}_1w` }]
    ]
  };

  bbLib.sendMessage(ctx.chat.id, `⏱ تایمفرەیم بۆ ${pair} دیاری بکە:`, {
    reply_markup: keyboard
  });
}

const pairs = ["XAUUSD", "EURUSD", "ETHUSD", "JPYUSD"];
const tfOptions = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

for (const pair of pairs) {
  for (const tf of tfOptions) {
    const callbackKey = `tf_${pair}_${tf}`;
    bbLib.onCallback(callbackKey, (ctx) => {
      bbLib.sendMessage(ctx.chat.id, `📡 شیکاری scalping بۆ ${pair} لە تایم ${tf} بە زووی دێت...`);
      // Simulate signal (placeholder)
      setTimeout(() => {
        const entry = 2000.00;
        const sl = entry - 0.0020;
        const tp = entry + (entry - sl) * 3;

        bbLib.sendMessage(ctx.chat.id,
          `✅ Entry: ${entry.toFixed(4)}
📉 SL: ${sl.toFixed(4)}
📈 TP: ${tp.toFixed(4)}
🪙 ${pair}`
        );
      }, 1500);
    });
  }
}
