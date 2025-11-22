# CapitalMasters Deployment Guide

## 🚀 Deploying to Netlify

### Prerequisites
- GitHub/GitLab/Bitbucket account with your repository
- Netlify account (free tier available)

### Method 1: Deploy via Netlify UI (Recommended)

1. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider
   - Select your CapitalMasters repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Select Node version: `18` or higher

4. **Environment Variables**
   Add these in Netlify Dashboard → Site Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   NEXT_PUBLIC_SITE_NAME=CapitalMasters
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this
   JWT_EXPIRES_IN=7d
   NEWSLETTER_API_KEY=your-newsletter-api-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-email-password
   CONTACT_EMAIL=contact@capitalmasters.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site.netlify.app`

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```
   - Follow the prompts to create a new site or link to existing

4. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_SITE_URL "https://your-site.netlify.app"
   netlify env:set JWT_SECRET "your-super-secret-jwt-key-min-32-chars"
   netlify env:set JWT_EXPIRES_IN "7d"
   # Add other variables...
   ```

5. **Deploy**
   ```bash
   # Test deploy
   netlify build
   
   # Production deploy
   netlify deploy --prod
   ```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong, unique value (min 32 characters)
- [ ] Update `.env.local` with production values
- [ ] Remove demo credentials from code (in `/app/api/auth/login/route.ts`)
- [ ] Set up a real database (replace mock data)
- [ ] Configure CORS properly
- [ ] Enable rate limiting on API routes
- [ ] Set up HTTPS (Netlify does this automatically)
- [ ] Configure CSP (Content Security Policy) headers
- [ ] Review and update privacy policy with your lawyer
- [ ] Add real email service integration

## 📊 Post-Deployment

1. **Test All Features**
   - [ ] Home page loads correctly
   - [ ] All navigation links work
   - [ ] Contact form submits successfully
   - [ ] Newsletter signup works
   - [ ] Client portal login/logout
   - [ ] Responsive design on mobile
   - [ ] Forms validation works

2. **Performance Optimization**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize images if needed
   - Enable caching headers

3. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Configure uptime monitoring
   - Set up analytics (Google Analytics, Plausible)

## 🔄 Continuous Deployment

Netlify automatically rebuilds when you push to your main branch:

```bash
git add .
git commit -m "Update features"
git push origin main
# Netlify automatically deploys
```

## 🌐 Custom Domain

1. **In Netlify Dashboard:**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain (e.g., `www.capitalmasters.com`)

2. **Update DNS Records:**
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify DNS (recommended)

3. **Enable HTTPS:**
   - Netlify provides free SSL certificate
   - Usually enabled automatically

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build fails with dependency errors
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue:** Environment variables not working
- Ensure they're set in Netlify Dashboard
- Restart build after adding variables
- Check variable names match code

### Runtime Errors

**Issue:** API routes return 404
- Ensure `netlify.toml` is properly configured
- Check API route file structure
- Verify Next.js API routing

**Issue:** Authentication not working
- Verify JWT_SECRET is set
- Check browser localStorage
- Ensure HTTPS is enabled

## 📱 Alternative Deployment Options

### Vercel (Alternative to Netlify)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Production:
   ```bash
   vercel --prod
   ```

### Self-Hosted (VPS/Cloud)

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "capitalmasters" -- start
   pm2 save
   ```

4. Set up Nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name capitalmasters.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📞 Support

For deployment issues:
- Check [Netlify Documentation](https://docs.netlify.com/)
- Check [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Review build logs in Netlify Dashboard

---

**Last Updated:** November 22, 2025
