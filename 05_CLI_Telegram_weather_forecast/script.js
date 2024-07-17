const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = "6367201733:AAEC_A5X7ih_dZxK2xf8i-RUw1TwIoWLbsQ";
const OPENWEATHERMAP_API_KEY = "02118fc635059bfa7dafe52c1c9aa5c5";
const CITY = "Kyiv";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Welcome! Choose the forecast interval for ${CITY}:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "With a 3-hour interval", callback_data: "3-hour" },
            { text: "With a 6-hour interval", callback_data: "6-hour" },
          ],
        ],
      },
    }
  );
});

bot.on("callback_query", async (callbackQuery) => {
  const message = callbackQuery.message;
  const interval = callbackQuery.data;
  const chatId = message.chat.id;

  try {
    const forecast = await getWeatherForecast(CITY, interval);
    bot.sendMessage(chatId, forecast);
  } catch (error) {
    bot.sendMessage(chatId, `Failed to fetch weather data: ${error.message}`);
  }
});

async function getWeatherForecast(city, interval) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;
  const forecasts = data.list;
  const intervalHours = interval === "3-hour" ? 3 : 6;
  const intervalForecasts = forecasts.filter(
    (item, index) => index % (intervalHours / 3) === 0
  );

  let forecastMessage = `Weather forecast for ${city} with a ${intervalHours}-hour interval:\n\n`;

  intervalForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    forecastMessage += `Date: ${date.toLocaleString()}\n`;
    forecastMessage += `Temperature: ${forecast.main.temp}°C\n`;
    forecastMessage += `Weather: ${forecast.weather[0].description}\n\n`;
  });

  return forecastMessage;
}

bot.on("polling_error", (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});
