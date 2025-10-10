# Western Capital - Vercel Deployment Guide

## ✅ Repository Status
Your code is successfully pushed to: **https://github.com/kiramogs/western-capital**

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Sign in to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"

### Step 2: Import Repository
1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Search for: `kiramogs/western-capital`
4. Click "Import"

### Step 3: Configure Project Settings
**IMPORTANT: Use these exact settings:**

```
Framework Preset: Other
Build Command: [LEAVE EMPTY]
Output Directory: [LEAVE EMPTY]
Install Command: [LEAVE EMPTY]
Root Directory: ./
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait 30-60 seconds for deployment to complete
3. Your site will be live at: `https://western-capital-xxxx.vercel.app`

## 🔧 What's Fixed

### 1. **Vercel Configuration** (`vercel.json`)
- ✅ Rewrites for directory routes (`/aboutus`, `/contactus`, etc.)
- ✅ PHP → API endpoint mapping
- ✅ Security headers
- ✅ Proper 404 handling

### 2. **Contact Form** 
- ✅ Replaced PHP with serverless API: `/api/send-contact-mail.js`
- ✅ Updated AJAX call in `js/app.js`
- ✅ Form validation preserved

### 3. **Static Routing**
All pages now route correctly:
- `/` → `index.html`
- `/aboutus` → `aboutus/index.html`
- `/contactus` → `contactus/index.html`
- `/advisors` → `advisors/index.html`
- And all other pages...

## 🧪 Test After Deployment

### Test Contact Form:
1. Visit: `https://your-vercel-url.vercel.app/contactus`
2. Fill out the form
3. Submit - you should see success message

### Test API Directly:
```bash
curl -X POST https://your-vercel-url.vercel.app/api/send-contact-mail \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","phone":"9876543210","email":"test@example.com","message":"Hello"}'
```

Expected response:
```json
{"success":true,"code":"contact-us","message":"Message received successfully. We will contact you soon!"}
```

## 📧 Email Integration (Optional)

The contact form currently logs submissions. To send actual emails, update `api/send-contact-mail.js` with one of:

### Option 1: Resend (Recommended)
```bash
npm install resend
```
[Resend Documentation](https://resend.com/docs)

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```
[SendGrid Documentation](https://docs.sendgrid.com)

### Option 3: Nodemailer
```bash
npm install nodemailer
```

## 🔗 Important Links

- **GitHub Repo**: https://github.com/kiramogs/western-capital
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Original Site**: https://westerncap.in

## 🐛 Troubleshooting

### 404 Errors?
- Check that `vercel.json` is at the root level
- Verify rewrites in Vercel dashboard: Settings → Rewrites
- Redeploy: Deployments → ... → Redeploy

### Contact Form Not Working?
- Open browser console (F12)
- Check for errors
- Verify API is accessible: `https://your-url.vercel.app/api/send-contact-mail`

### Build Errors?
- This is a **static site** - build command should be EMPTY
- Framework should be "Other"
- No package.json needed for static HTML

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] `vercel.json` configured
- [x] API function created
- [x] Contact form updated
- [ ] Vercel project created
- [ ] Site deployed
- [ ] Contact form tested
- [ ] Email service integrated (optional)

---

**Need Help?** 
- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support

