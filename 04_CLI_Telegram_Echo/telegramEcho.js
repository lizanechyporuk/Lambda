import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

const botToken = "7471340606:AAHIu4s6SlFGOw4QV2iYdtSq8tJzwqofiEc";

const bot = new TelegramBot(botToken, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(
    `Received message from ${msg.from.username || msg.from.first_name}: ${text}`
  );

  if (text.toLowerCase() === "photo") {
    try {
      const timestamp = new Date().getTime();
      const randomImageUrl = `https://picsum.photos/200/300?${timestamp}`;
      await bot.sendPhoto(chatId, randomImageUrl);
      console.log(
        `Sent a random photo to ${msg.from.username || msg.from.first_name}`
      );
    } catch (error) {
      console.error("Error sending photo:", error);
      bot.sendMessage(chatId, "Failed to send photo. Please try again later.");
    }
  }
});
