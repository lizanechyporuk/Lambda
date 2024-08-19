const inquirer = require("inquirer");

const users = [];

async function addUser() {
  while (true) {
    const { name } = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter user name (or press ENTER to stop adding users):",
    });

    if (!name.trim()) {
      break;
    }

    const { gender } = await inquirer.prompt({
      type: "list",
      name: "gender",
      message: "Select user gender:",
      choices: [
        { name: "Male", value: "male" },
        { name: "Female", value: "female" },
        { name: "Other", value: "other" },
      ],
    });

    const { age } = await inquirer.prompt({
      type: "input",
      name: "age",
      message: "Enter user age:",
      validate: (value) => {
        const valid = !isNaN(parseFloat(value)) && value > 0;
        return valid || "Please enter a valid age";
      },
      filter: Number,
    });

    users.push({ name, gender, age });

    const { continueAdding } = await inquirer.prompt({
      type: "confirm",
      name: "continueAdding",
      message: "Do you want to add another user?",
      default: true,
    });

    if (!continueAdding) {
      break;
    }
  }

  findUser();
}

async function findUser() {
  const { search } = await inquirer.prompt({
    type: "confirm",
    name: "search",
    message: "Do you want to search for a user by name? (Y/N)",
    default: true,
  });

  if (!search) {
    console.log("Exiting the application.");
    process.exit();
  }

  const { searchName } = await inquirer.prompt({
    type: "input",
    name: "searchName",
    message: "Enter the name of the user to search for:",
  });

  const matchingUsers = users.filter(
    (u) => u.name.toLowerCase().trim() === searchName.toLowerCase().trim()
  );

  if (matchingUsers.length > 0) {
    console.log(`Found ${matchingUsers.length} user(s):`);

    matchingUsers.forEach((u, i) => {
      console.log(`User ${i + 1}:`);
      console.log(`Name: ${u.name}`);
      console.log(`Gender: ${u.gender}`);
      console.log(`Age: ${u.age}`);
    });
  } else {
    console.log("User not found.");
  }

  process.exit();
}

addUser();
