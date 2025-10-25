# Electron App Build Instructions

This project can be built as a desktop application using Electron.

## Prerequisites

Before building the Electron app, make sure to install the new dependencies:

```bash
npm install
```

## Available Electron Scripts

### Development
Run the Electron app in development mode (opens with dev tools):
```bash
npm run electron:dev
```

**Note:** Make sure to run `npm run dev` in a separate terminal first to start the Vite dev server on port 5173, then run `npm run electron:dev` to launch the Electron window.

### Building for Production

#### Build for all platforms
```bash
npm run electron:build
```

#### Build for specific platforms

**macOS:**
```bash
npm run electron:build:mac
```
Output: Creates DMG and ZIP files in the `release` directory

**Windows:**
```bash
npm run electron:build:win
```
Output: Creates NSIS installer and portable executable in the `release` directory

**Linux:**
```bash
npm run electron:build:linux
```
Output: Creates AppImage and DEB package in the `release` directory

## Build Configuration

The Electron build is configured in `package.json` under the `build` section:

- **App ID:** `com.skyscout.view`
- **Product Name:** Sky Scout View
- **Output Directory:** `release/`
- **Icon:** `public/icon.png` (make sure to add your app icon here)

## Files Structure

- `electron.cjs` - Main Electron process (app entry point)
- `preload.cjs` - Preload script for secure context bridging
- `dist/` - Built React app (created by `npm run build`)
- `release/` - Built Electron packages (created by electron-builder)

## Important Notes

1. **Cross-platform builds:** To build for Windows from Mac/Linux or vice versa, you may need additional dependencies. See [electron-builder documentation](https://www.electron.build/multi-platform-build) for details.

2. **Code signing:** For production releases, especially macOS and Windows, you'll need to configure code signing. Update the `build` section in `package.json` with your certificates.

3. **Icon requirements:**
   - macOS: 512x512 PNG or ICNS file
   - Windows: 256x256 PNG or ICO file
   - Linux: 512x512 PNG file

4. **Auto-update:** To add auto-update functionality, integrate `electron-updater` and configure your update server.

## Troubleshooting

**Issue:** "Cannot find module 'electron'"
**Solution:** Run `npm install` to install all dependencies

**Issue:** Build fails on macOS
**Solution:** Make sure you have Xcode Command Line Tools installed: `xcode-select --install`

**Issue:** Build fails on Windows
**Solution:** Make sure you have Windows Build Tools installed: `npm install --global windows-build-tools`

## Development Workflow

1. Start Vite dev server: `npm run dev`
2. In another terminal, start Electron: `npm run electron:dev`
3. Make changes to your React app - Vite will hot reload
4. Refresh the Electron window to see changes

## Production Build Workflow

1. Build the React app: `npm run build`
2. Build the Electron app: `npm run electron:build:mac` (or your target platform)
3. Find the built app in the `release/` directory
