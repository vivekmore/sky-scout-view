# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f79ab9f0-fadd-4b78-b56b-2baeceb39227

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f79ab9f0-fadd-4b78-b56b-2baeceb39227) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f79ab9f0-fadd-4b78-b56b-2baeceb39227) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Local Development

Follow these steps:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions (`.github/workflows/deploy.yml`).

1. Push to `main` (or `master`).
2. The workflow installs dependencies, builds with `FOR_GH_PAGES=1` (triggering the correct Vite base), and publishes `dist` to Pages.
3. Ensure in Repo Settings > Pages the Source is set to GitHub Actions (after first successful run it's automatic).

Your site will be available at:

```
https://<your-username>.github.io/<repo-name>/
```

### How Routing Works

- `vite.config.ts` sets `base` dynamically:
  - Dev: `/`
  - Local prod build: `./` (so you can open `dist` or serve it locally)
  - GitHub Pages / CI: `/<repoName>/` (derived from `GITHUB_REPOSITORY` or fallback)
  - Root site repo `<user>.github.io`: `/`
- `src/App.tsx` uses `computeBasename()` which normalizes `import.meta.env.BASE_URL`:
  - Treats `/` and `./` as an empty basename (so local `npx serve -s dist` works without a leading dot)
  - For subpaths like `/my-repo/` it trims the trailing slash and keeps a single leading slash (basename becomes `/my-repo`)
- `npm run build:pages` copies `dist/index.html` to `dist/404.html` to support deep links on GitHub Pages.

### Favicon

`index.html` uses a relative favicon path: `favicon.png`. This ensures it resolves correctly under the sub-path (`/<repo-name>/favicon.png`) on GitHub Pages and still works locally.

### Manual Build Test

```sh
# Standard local production build (relative asset paths, no subpath)
npm run build
npx serve -s dist

# Simulate GitHub Pages project subpath locally
FOR_GH_PAGES=1 npm run build:pages
npx serve -s dist
```

If simulating the GH Pages build, remember assets expect to live under `/<repo-name>/`. When served from root by a simple server they will still load because absolute URLs are generated with that subpath. To truly test routing under the subpath locally you can use a proxy server or temporarily move `dist` under a matching directory name.

### Troubleshooting

- Blank page locally after `npx serve -s dist`: Ensure you rebuilt after pulling the latest changes that include the updated `computeBasename()` logic. The previous implementation could set a basename of `.` causing no route match.
- Wrong paths / 404s: Confirm `base` inside the built `dist/index.html` points to the expected value.
- Favicon missing: Ensure `public/favicon.png` exists (Vite copies it automatically).
- Router not matching on Pages: Make sure `404.html` was published (use `build:pages` or the CI workflow).

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query

## Notes

If you rename the repository later, the next deploy will pick up the new name automatically (detected from `GITHUB_REPOSITORY`). For local production previews (without GH env vars) the base stays relative (`./`) so assets still load when opened from filesystem or a simple static server.
