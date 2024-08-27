import fs from "fs";
import path from "path";

const directoryPath = "./2kk_words_400x400";

function readPhrasesFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const phrases = data.split("\n").map((line) => line.trim());
  return new Set(phrases);
}

function processFiles(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const totalFiles = files.length;
  const allUsernamesSet = new Set();
  const usernamesInAllFiles = new Set();
  const usernamesInAtLeast10Files = new Map();

  console.time("Execution Time");

  files.forEach((file, index) => {
    const filePath = path.join(directoryPath, file);
    const currentSet = readPhrasesFromFile(filePath);

    currentSet.forEach((username) => allUsernamesSet.add(username));

    if (index === 0) {
      currentSet.forEach((username) => usernamesInAllFiles.add(username));
    } else {
      usernamesInAllFiles.forEach((username) => {
        if (!currentSet.has(username)) {
          usernamesInAllFiles.delete(username);
        }
      });
    }

    currentSet.forEach((username) => {
      const count = usernamesInAtLeast10Files.get(username) || 0;
      usernamesInAtLeast10Files.set(username, count + 1);
    });
  });

  const usernamesInAtLeast10FilesCount = [
    ...usernamesInAtLeast10Files.values(),
  ].filter((count) => count >= 10).length;

  console.timeEnd("Execution Time");

  console.log(
    `1. Total unique usernames across all files: ${allUsernamesSet.size}`
  );
  console.log(
    `2. Usernames that appear in all 20 files: ${usernamesInAllFiles.size}`
  );
  console.log(
    `3. Usernames that appear in at least 10 files: ${usernamesInAtLeast10FilesCount}`
  );
}

processFiles(directoryPath);
