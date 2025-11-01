# Western Capital Advisors - Deployment Guide

## Local Development Server

The site is now running locally at:
**http://localhost:5173**

To start the server manually:
```bash
node serve.cjs
```

## Production Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Your project is already configured for Vercel with `vercel.json`.

**Steps to deploy:**

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

Or deploy from the Vercel dashboard:
- Go to https://vercel.com
- Import your Git repository
- Vercel will automatically detect the `vercel.json` configuration

### Option 2: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Option 3: Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d ."
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Traditional Web Hosting

Upload all files via FTP/SFTP to your web hosting provider:
- Upload all files to the root directory or `public_html`
- Ensure `.htaccess` or server config supports clean URLs
- All paths should work as-is since they're relative

## Important Files for Deployment

- `vercel.json` - Vercel deployment configuration
- `serve.cjs` - Local development server
- `404.html` - Custom 404 page
- All HTML files in root and subdirectories
- `/css/` - Stylesheets
- `/js/` - JavaScript files
- `/img/` - Images
- `/pdfs/` - PDF documents
- `/vendor/` - Third-party libraries

## Environment Variables (if needed)

No environment variables are currently required. The site is fully static.

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Check all navigation links work
- [ ] Verify footer links resolve
- [ ] Test contact form (if backend is configured)
- [ ] Check PDF downloads work
- [ ] Verify responsive design on mobile devices
- [ ] Test all subpages (aboutus, contactus, etc.)

## Current Server Status

✅ Local server running on http://localhost:5173

