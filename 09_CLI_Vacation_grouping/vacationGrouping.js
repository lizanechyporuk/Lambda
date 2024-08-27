import fs from "fs";

const rawData = fs.readFileSync("vacationsInitial.json");
const vacations = JSON.parse(rawData);

const transformedData = {};

vacations.forEach((vacation) => {
  const userId = vacation.user._id;
  const userName = vacation.user.name;
  const vacationPeriod = {
    startDate: vacation.startDate,
    endDate: vacation.endDate,
  };

  if (transformedData[userId]) {
    transformedData[userId].weekendDates.push(vacationPeriod);
  } else {
    transformedData[userId] = {
      userId: userId,
      name: userName,
      weekendDates: [vacationPeriod],
    };
  }
});

const result = Object.values(transformedData);

fs.writeFileSync("vacationsTransformed.json", JSON.stringify(result, null, 2));

console.log(
  "Transformation complete. Check the vacationsTransformed.json file."
);
