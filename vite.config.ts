import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isElectron = process.env.ELECTRON_BUILD === "true";
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "sky-scout-view";
  const isGhCI = !!process.env.GITHUB_ACTIONS || !!process.env.FOR_GH_PAGES;
  const isRootGhPages = /.+\.github\.io$/i.test(repoName);

  // Strategy:
  //  - Dev: base "/" (Vite dev server)
  //  - Electron build: relative "./" for file:// protocol
  //  - Local production build (no GH env): relative "./" so `npx serve -s dist` works
  //  - GitHub Pages CI project site: absolute subpath so deep-links resolve properly
  //  - GitHub Pages root site (<user>.github.io): base "/"
  const basePath = isRootGhPages ? "/" : `/${repoName}/`;
  const prodBase = isElectron ? "./" : isGhCI ? basePath : "./";
  const devBase = "/";
  const base = isDev ? devBase : prodBase;

  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
