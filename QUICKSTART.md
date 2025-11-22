# Quick Start Guide - CapitalMasters

Get your CapitalMasters web application up and running in minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies (2 minutes)
```bash
npm install
```

### 2. Configure Environment (1 minute)
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your preferred text editor
# For testing, you can use the default values
```

### 3. Start Development Server (1 minute)
```bash
npm run dev
```

### 4. Open Your Browser (30 seconds)
Navigate to: **http://localhost:3000**

### 5. Test the Application (30 seconds)
Try the demo login:
- Go to: http://localhost:3000/client-portal
- Email: `demo@capitalmasters.com`
- Password: `demo123`

## 🎯 What to Explore

### Public Pages
- **Home** (`/`) - Landing page with company overview
- **About** (`/about`) - Company story and team
- **Services** (`/services`) - Investment services
- **Resources** (`/resources`) - Articles and FAQs
- **Compliance** (`/compliance`) - Legal information
- **Contact** (`/contact`) - Contact form

### Protected Pages
- **Client Portal** (`/client-portal`) - Secure investor dashboard

### API Endpoints
Test with tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@capitalmasters.com","password":"demo123"}'

# Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","subject":"general","message":"Test message"}'

# Newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

## 📝 Common Tasks

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

## 🔧 Customization

### Change Colors
Edit `app/globals.css` - primary colors are based on sky blue palette

### Update Company Info
- Navbar: `components/layout/Navbar.tsx`
- Footer: `components/layout/Footer.tsx`
- Contact details: `app/contact/page.tsx`

### Add Real Database
Replace mock data in:
- `app/api/auth/login/route.ts`
- `app/api/auth/verify/route.ts`

### Integrate Email Service
Update:
- `app/api/contact/route.ts`
- `app/api/newsletter/route.ts`

## 🚀 Next Steps

1. **Review the full README.md** for detailed documentation
2. **Check DEPLOYMENT.md** for deployment instructions
3. **Read CONTRIBUTING.md** if you plan to contribute
4. **Customize content** to match your company branding
5. **Set up real services** (database, email, etc.)
6. **Deploy to Netlify** following the deployment guide

## 💡 Tips

- Hot reload is enabled - changes appear instantly
- Check browser console for any errors
- Use browser DevTools to test responsive design
- All forms have client-side validation

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
# Use a different port
PORT=3001 npm run dev
```

**Build errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Environment variables not working?**
- Ensure `.env.local` exists
- Restart the dev server after changes
- Check for typos in variable names

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Ready to build something amazing? Let's go! 🚀**

Questions? Check the README.md or open an issue.
