import fs from "fs-extra";
import path from "path";
import { google } from "googleapis";
import inquirer from "inquirer";
import readlineSync from "readline-sync";
import fetch from "node-fetch";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";

async function authenticate() {
  const { client_id, client_secret, redirect_uris } = (
    await fs.readJSON("credentials.json")
  ).installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (await fs.pathExists(TOKEN_PATH)) {
    const token = await fs.readJSON(TOKEN_PATH);
    oAuth2Client.setCredentials(token);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const code = readlineSync.question("Enter the code from that page here: ");
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeJSON(TOKEN_PATH, tokens);
  }

  return google.drive({ version: "v3", auth: oAuth2Client });
}

async function uploadFile(drive, filePath, newName) {
  const normalizedPath = path.normalize(filePath.trim());
  const ext = path.extname(normalizedPath);

  const fileMetadata = {
    name: newName ? `${newName}${ext}` : path.basename(filePath),
    parents: ["1XCut3BciZYbTBBpGB3qAJumUV1G2QTb1"],
  };

  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream(normalizedPath),
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = res.data.id;
  console.log(`File uploaded successfully with ID: ${fileId}`);

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}

async function shortenURL(longURL) {
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`
    );
    const shortURL = await response.text();
    return shortURL;
  } catch (error) {
    console.error("Error while shortening the URL:", error);
    throw new Error("Failed to shorten the URL.");
  }
}

async function main() {
  const drive = await authenticate();

  const { filePath } = await inquirer.prompt([
    {
      type: "input",
      name: "filePath",
      message: "Drag and drop your image here:",
    },
  ]);

  const { rename } = await inquirer.prompt([
    {
      type: "confirm",
      name: "rename",
      message: "Do you want to rename the file?",
      default: false,
    },
  ]);

  let newName;
  if (rename) {
    const { newFileName } = await inquirer.prompt([
      {
        type: "input",
        name: "newFileName",
        message: "Enter the new file name (without extension):",
      },
    ]);
    newName = newFileName;
  }

  const fileURL = await uploadFile(drive, filePath, newName);

  const { shorten } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shorten",
      message: "Do you want to shorten the URL?",
      default: true,
    },
  ]);

  if (shorten) {
    const shortURL = await shortenURL(fileURL);
    console.log("Shortened URL:", shortURL);
  } else {
    console.log("Original URL:", fileURL);
  }
}

main().catch(console.error);
