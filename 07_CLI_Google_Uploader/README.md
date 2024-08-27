# 07_CLI_Google_Uploader

## Overview

This is a CLI-based Node.js application that allows users to upload images to Google Drive. Users can also rename the file before uploading and generate a shareable URL, with the option to shorten it using TinyURL.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**
- **npm** or **yarn**
- **Google API Credentials**: `credentials.json`

## Running the application

### 1.Start the application:

```bash
node googleUploader.js
```

### 2.Authorize the application:

On the first run, you'll be prompted to authorize access to your Google Drive. This generates a token.json file to store your credentials for future use.

### 3.Upload an image:

**Provide File Path:** You can drag and drop your image file into the terminal or manually type the path to your image.
**Rename File (Optional):** You'll be asked if you'd like to rename the file before uploading. If you choose Yes, you can provide a new file name (excluding the file extension).

### 4.URL shortening:

After the file upload, the app will ask if you want to shorten the generated URL using TinyURL.
If you choose Yes, a shortened URL will be provided. Otherwise, the original Google Drive URL will be displayed.

## Example workflow

### 1.File path prompt:

```bash
? Drag and drop your image here: C:\Path\To\Your\Images\sample-image.jpg
```

### 2.Rename file prompt:

```bash
? Do you want to rename the file? yes
? Enter the new file name (without extension): my-sample-image
```

### 3.URL shortening prompt:

```bash
? Do you want to shorten the URL? yes
Shortened URL: https://tinyurl.com/zzzzzz
```
