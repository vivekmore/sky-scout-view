const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

async function loadURL(mainWindow, url, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await mainWindow.loadURL(url);
      console.log("Successfully loaded URL:", url);
      return;
    } catch (err) {
      console.log(`Attempt ${i + 1}/${retries}: Waiting for dev server...`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        console.error("Failed to load URL after", retries, "attempts");
        console.error("Make sure the Vite dev server is running on http://localhost:8080");
        throw err;
      }
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
      webSecurity: true,
    },
    icon: path.join(__dirname, "public", "icon.png"),
    show: false, // Don't show until ready
  });

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Load the app
  if (isDev) {
    console.log("Running in development mode");
    console.log("Loading URL: http://localhost:8080");

    loadURL(mainWindow, "http://localhost:8080")
      .then(() => {
        mainWindow.webContents.openDevTools();
      })
      .catch((err) => {
        console.error("Error loading dev server:", err.message);
      });

    // Log any console messages from the renderer
    mainWindow.webContents.on("console-message", (event, level, message) => {
      console.log("Renderer:", message);
    });
  } else {
    const indexPath = path.join(__dirname, "dist", "index.html");
    console.log("Loading file:", indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Handle loading errors
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });

  // Handle window close
  mainWindow.on("closed", () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
