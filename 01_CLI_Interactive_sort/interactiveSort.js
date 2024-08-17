const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function processInput(input) {
  const items = input.split(" ");
  const words = items.filter((item) => isNaN(item));
  const numbers = items.filter((item) => !isNaN(item)).map(Number);

  rl.question(
    `
  Choose an operation:
  1. Sort the words alphabetically.
  2. Display the numbers in ascending order.
  3. Display the numbers in descending order.
  4. Display the words in ascending order based on the number of letters in each word.
  5. Show only unique words.
  6. Show only the unique values from the entire set of words and numbers entered by the user.
  Enter the operation number: `,

    (operation) => {
      switch (operation) {
        case "1":
          console.log("Words sorted alphabetically:", words.sort());
          break;

        case "2":
          console.log(
            "Numbers in ascending order:",
            numbers.sort((a, b) => a - b)
          );
          break;

        case "3":
          console.log(
            "Numbers in descending order:",
            numbers.sort((a, b) => b - a)
          );
          break;

        case "4":
          console.log(
            "Words sorted by length:",
            words.sort((a, b) => a.length - b.length)
          );
          break;

        case "5":
          console.log("Unique words:", [...new Set(words)]);
          break;

        case "6":
          console.log("Unique values:", [...new Set(items)]);
          break;

        default:
          console.log("Invalid operation.");
      }

      askInput();
    }
  );
}

function askInput() {
  rl.question(
    "\nEnter 10 words and numbers separated by spaces (or type 'exit' to quit): ",
    (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
      } else {
        processInput(input);
      }
    }
  );
}

askInput();
