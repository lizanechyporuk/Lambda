import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const botToken = "6367201733:AAEC_A5X7ih_dZxK2xf8i-RUw1TwIoWLbsQ";
const weatherAPIKey = "02118fc635059bfa7dafe52c1c9aa5c5";
const city = "Kyiv";

const bot = new TelegramBot(botToken, { polling: true });

let exchangeRateCache = {};
const cacheDuration = 10 * 60 * 1000;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showMainMenu(chatId);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "Weather forecast") {
    showWeatherMenu(chatId);
  } else if (text === "Currency") {
    showCurrencyMenu(chatId);
  } else if (text === "Back to main menu") {
    showMainMenu(chatId);
  } else if (text === "With a 3-hour interval") {
    try {
      const forecast = await getWeatherForecast(city, "3-hour");
      bot.sendMessage(chatId, forecast, {
        reply_markup: {
          keyboard: [["Back to weather menu"], ["Back to main menu"]],
          resize_keyboard: true,
        },
      });
    } catch (error) {
      bot.sendMessage(chatId, `Failed to fetch weather data: ${error.message}`);
    }
  } else if (text === "With a 6-hour interval") {
    try {
      const forecast = await getWeatherForecast(city, "6-hour");
      bot.sendMessage(chatId, forecast, {
        reply_markup: {
          keyboard: [["Back to weather menu"], ["Back to main menu"]],
          resize_keyboard: true,
        },
      });
    } catch (error) {
      bot.sendMessage(chatId, `Failed to fetch weather data: ${error.message}`);
    }
  } else if (text === "USD") {
    try {
      const rates = await getCachedExchangeRate("USD");
      const rateMessage = `USD Exchange Rates:\n\nPrivatBank: ${rates.privat}\nMonobank: ${rates.mono}`;
      bot.sendMessage(chatId, rateMessage, {
        reply_markup: {
          keyboard: [["Back to currency menu"], ["Back to main menu"]],
          resize_keyboard: true,
        },
      });
    } catch (error) {
      bot.sendMessage(
        chatId,
        `Failed to fetch exchange rate data: ${error.message}`
      );
    }
  } else if (text === "EUR") {
    try {
      const rates = await getCachedExchangeRate("EUR");
      const rateMessage = `EUR Exchange Rates:\n\nPrivatBank: ${rates.privat}\nMonobank: ${rates.mono}`;
      bot.sendMessage(chatId, rateMessage, {
        reply_markup: {
          keyboard: [["Back to currency menu"], ["Back to main menu"]],
          resize_keyboard: true,
        },
      });
    } catch (error) {
      bot.sendMessage(
        chatId,
        `Failed to fetch exchange rate data: ${error.message}`
      );
    }
  } else if (text === "Back to currency menu") {
    showCurrencyMenu(chatId);
  } else if (text === "Back to weather menu") {
    showWeatherMenu(chatId);
  }
});

function showMainMenu(chatId) {
  bot.sendMessage(chatId, "Welcome! Choose an option:", {
    reply_markup: {
      keyboard: [["Weather forecast", "Currency"]],
      resize_keyboard: true,
    },
  });
}

function showWeatherMenu(chatId) {
  bot.sendMessage(chatId, `Choose the forecast interval for ${city}:`, {
    reply_markup: {
      keyboard: [
        ["With a 3-hour interval", "With a 6-hour interval"],
        ["Back to main menu"],
      ],
      resize_keyboard: true,
    },
  });
}

function showCurrencyMenu(chatId) {
  bot.sendMessage(chatId, "Choose the currency:", {
    reply_markup: {
      keyboard: [["USD", "EUR"], ["Back to main menu"]],
      resize_keyboard: true,
    },
  });
}

async function getWeatherForecast(city, interval) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherAPIKey}`;
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

async function getCachedExchangeRate(currency) {
  const now = Date.now();
  if (
    exchangeRateCache[currency] &&
    now - exchangeRateCache[currency].timestamp < cacheDuration
  ) {
    return exchangeRateCache[currency].rates;
  }
  const rates = await getExchangeRates(currency);
  exchangeRateCache[currency] = { rates, timestamp: now };
  return rates;
}

async function getExchangeRates(currency) {
  const privatbankUrl = `https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11`;
  const monobankUrl = `https://api.monobank.ua/bank/currency`;

  const [privatResponse, monoResponse] = await Promise.all([
    axios.get(privatbankUrl),
    axios.get(monobankUrl),
  ]);

  let privatRate = null;
  let monoRate = null;

  privatResponse.data.forEach((item) => {
    if (item.ccy === currency) {
      privatRate = item.sale;
    }
  });

  monoResponse.data.forEach((item) => {
    if (
      item.currencyCodeA === (currency === "USD" ? 840 : 978) &&
      item.currencyCodeB === 980
    ) {
      monoRate = item.rateSell;
    }
  });

  if (!privatRate || !monoRate) {
    throw new Error(`Could not fetch exchange rate for ${currency}`);
  }

  return { privat: privatRate, mono: monoRate };
}

bot.on("polling_error", (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});
