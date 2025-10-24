import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "sky-scout-view";
  const isProd = mode === "production";
  const isGitHub = !!process.env.GITHUB_REPOSITORY || !!process.env.GITHUB_ACTIONS;
  return {
    // Use subpath only in GitHub CI production builds; keep "/" locally for easier preview.
    base: isProd && isGitHub ? `/${repoName}/` : "/",
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
