# Mental Strain Records Website

Official website for Mental Strain Records - An independent music label.

## Deployment to Cloudflare Pages

This website is designed to be deployed on Cloudflare Pages. Follow these steps to deploy:

### Method 1: Connect Git Repository (Recommended)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select this repository (`kaywebs/msr-web`)
6. Configure your build settings:
   - **Production branch**: `main` (or your preferred branch)
   - **Build command**: Leave empty (static HTML site)
   - **Build output directory**: `/` (root directory)
7. Click **Save and Deploy**

Your site will be automatically deployed whenever you push changes to your repository.

### Method 2: Direct Upload via Wrangler CLI

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy the site:
   ```bash
   wrangler pages deploy . --project-name=msr-web
   ```

### Method 3: Drag and Drop Upload

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages**
3. Click **Create a project**
4. Choose **Direct upload**
5. Drag and drop the website files or select them from your file browser
6. Click **Deploy site**

## Local Development

To preview the site locally, you can use any static web server. For example:

### Using Python:
```bash
python -m http.server 8000
```

### Using Node.js (http-server):
```bash
npx http-server -p 8000
```

Then open your browser to `http://localhost:8000`

## Site Structure

```
msr-web/
├── index.html      # Home page
├── about.html      # About page
├── artists.html    # Artists page
├── contact.html    # Contact page
├── styles.css      # Stylesheet
└── README.md       # This file
```

## Custom Domain

After deploying to Cloudflare Pages, you can configure a custom domain:

1. Go to your Pages project in the Cloudflare Dashboard
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

## Environment

- No build process required
- Pure HTML/CSS static website
- Compatible with all modern browsers
- Mobile responsive design

## Support

For issues or questions, please open an issue in this repository.

---

© 2026 Mental Strain Records
