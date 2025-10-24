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

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. Ensure your repository is named the same as the folder (default assumed: `sky-scout-view`). If different, update the fallback repo name in `vite.config.ts`.
2. Push changes to `main` (or `master`). The workflow at `.github/workflows/deploy.yml` will:
   - Install dependencies
   - Run `npm run build:pages` (which also creates `dist/404.html` for SPA fallback)
   - Publish the `dist` folder to GitHub Pages
3. In your repo Settings > Pages, make sure Source is set to GitHub Actions (it will be automatic after first successful deploy).

Your site will be available at:

```
https://<your-username>.github.io/<repo-name>/
```

### How Routing Works

- Vite `base` is set dynamically in `vite.config.ts` using `GITHUB_REPOSITORY` during CI.
- React Router `BrowserRouter` uses `import.meta.env.BASE_URL` (normalized) as `basename`.
- A copy of `index.html` is saved as `404.html` to ensure deep links work on GitHub Pages.

### Manual Build Test

```sh
npm run build:pages
npx serve -s dist  # or any static server to preview locally
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query

## Notes

If you rename the repository later, deployments will still work (CI injects `GITHUB_REPOSITORY`). For local development the base remains `/`.
