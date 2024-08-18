const { Command } = require("commander");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const fs = require("fs");

const bot = new TelegramBot("7471340606:AAHIu4s6SlFGOw4QV2iYdtSq8tJzwqofiEc", {
  polling: true,
});

const program = new Command();

program
  .command("message <text>")
  .alias("m")
  .description("Send a message to the Telegram bot")
  .action((text) => {
    bot
      .sendMessage("726035893", text)
      .then(() => {
        console.log("Message sent successfully!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Failed to send message:", error.message);
        process.exit(1);
      });
  });

program
  .command("photo <photoPath>")
  .alias("p")
  .description("Send a photo to the Telegram bot")
  .action((photoPath) => {
    const resolvedPath = path.resolve(photoPath);

    if (!fs.existsSync(resolvedPath)) {
      console.error("File not found:", resolvedPath);
      process.exit(1);
    }

    bot
      .sendPhoto("726035893", resolvedPath)
      .then(() => {
        console.log("Photo sent successfully!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Failed to send photo:", error.message);
        process.exit(1);
      });
  });

program.on("--help", () => {
  console.log("");
  console.log("Examples:");
  console.log("node app message 'Hello, World!'");
  console.log("node app photo /path/to/photo/picture.png");
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
