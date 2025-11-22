# CapitalMasters - Professional Investment Company Web Application

A fully functional, server-side rendered web application built with Next.js 14+ for CapitalMasters, a Ugandan investment firm driving Africa's economic transformation. Features modern architecture, secure authentication, and optimized performance.

## 🚀 Features

### Pages
- **Home**: Company overview with logo, tagline, trust indicators, and compelling CTAs
- **About**: Company story, mission, vision, core values, leadership profiles, and CSR initiatives
- **Services**: 8 detailed investment offerings, key sectors (Real Estate, Financial Services, Agribusiness, Technology), downloadable brochures
- **Resources**: Educational articles, expandable FAQs with structured data, newsletter signup
- **Investor Protection**: Comprehensive page detailing regulatory compliance, fund segregation, security measures, insurance coverage, and transparent governance
- **Compliance**: UIA & CMA licensing, SEC/FINRA registration, privacy policy, terms of service
- **Contact**: Interactive form with Google Maps embed, company info, and social links
- **Register**: User registration for individual, corporate, and institutional investors
- **Client Portal**: Personalized secure dashboard with:
  - Real-time portfolio data from MongoDB
  - Interactive charts (asset allocation pie chart, performance line chart)
  - Recent transactions and documents
  - Editable profile management
  - Downloadable PDF statements and reports
  - Account type differentiation (individual/corporate/institutional)

### Technical Features
- ✅ Server-side rendering (SSR) with Next.js App Router
- ✅ **MongoDB Atlas integration** for real data persistence
- ✅ **User registration** with account type differentiation (individual/corporate/institutional)
- ✅ **Personalized dashboards** tailored to user type
- ✅ JWT-based authentication with proxy (Next.js 16+) for route protection
- ✅ **Automatic session management** with token expiration checking
- ✅ **Interactive data visualizations** with Recharts (pie charts, line charts)
- ✅ **PDF generation** for portfolio statements and transaction reports
- ✅ **Editable user profiles** with secure updates
- ✅ API routes for auth, profile, contact, newsletter, and dashboard data
- ✅ React Context for global state management (auth, user data)
- ✅ Responsive design with Tailwind CSS (mobile-first)
- ✅ Form validation with Zod and real-time feedback
- ✅ ARIA-compliant accessible components
- ✅ Image optimization with next/image
- ✅ SEO optimized with metadata and structured data (JSON-LD)
- ✅ Custom loading and error states
- ✅ Professional logo component
- ✅ Google Maps integration
- ✅ Database seeding script for demo data
- ✅ Smooth transitions and animations
- ✅ Deployment ready for Netlify

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Update the values with your MongoDB URI and configuration
   ```bash
   cp .env.example .env.local
   ```

3. **Seed the database (first time only):**
```bash
npm run seed
```
   This creates the demo user and populates MongoDB with sample portfolio data.

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

To access the Client Portal, use these credentials:

- **Email:** demo@capitalmasters.com
- **Password:** demo123

## 📁 Project Structure

```
CapitalMasters/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts    # MongoDB user authentication
│   │   │   ├── logout/route.ts
│   │   │   └── verify/route.ts
│   │   ├── contact/route.ts      # Contact form (saves to MongoDB)
│   │   ├── dashboard/route.ts    # Fetch user portfolio data
│   │   └── newsletter/route.ts   # Newsletter (saves to MongoDB)
│   ├── about/page.tsx            # About page
│   ├── services/page.tsx         # Services page
│   ├── resources/page.tsx        # Resources page
│   ├── compliance/page.tsx       # Compliance page
│   ├── contact/page.tsx          # Contact page
│   ├── client-portal/page.tsx    # Client portal (MongoDB data)
│   ├── loading.tsx               # Global loading component
│   ├── error.tsx                 # Error boundary
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Logo.tsx                  # Company logo component
│   └── layout/
│       ├── Navbar.tsx            # Navigation bar
│       └── Footer.tsx            # Footer
├── context/                      # React Context
│   └── AuthContext.tsx           # Authentication context
├── lib/                          # Utilities
│   ├── mongodb.ts                # MongoDB connection
│   ├── models.ts                 # TypeScript data models
│   └── seo.ts                    # SEO structured data utilities
├── scripts/                      # Utility scripts
│   └── seed.js                   # Database seeding script
├── public/                       # Static assets
├── proxy.ts                      # Route protection (Next.js 16)
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (gitignored)
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── netlify.toml                  # Netlify deployment config
└── package.json                  # Dependencies
```

## 🎨 Tech Stack

- **Framework:** Next.js 16+ (App Router with Turbopack)
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS v4
- **Authentication:** JWT with jose library, bcryptjs for password hashing
- **Form Validation:** Zod
- **Form Handling:** react-hook-form
- **Icons:** Heroicons
- **State Management:** React Context API

## 🔧 Available Scripts

```bash
# Database
npm run seed         # Populate MongoDB with demo data

# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for automatic deployments.

### Environment Variables for Production

Make sure to set these in your Netlify dashboard:

- `NEXT_PUBLIC_SITE_URL` - Your production URL
- `JWT_SECRET` - Strong secret key (min 32 characters)
- `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- Email service credentials (if using email functionality)

## 🔒 Security Features

- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- CSRF protection
- XSS protection headers
- Rate limiting on API routes (recommended to add)
- Input validation and sanitization
- Secure environment variable handling

## 📱 Responsive Design

The application is fully responsive and tested on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG AA)
- Focus indicators

## 🎯 Performance Optimizations

- Server-side rendering for initial page load
- Automatic code splitting
- Image optimization with next/image
- Font optimization with next/font
- Lazy loading of components
- Efficient bundle size

## 🧪 Testing

To add testing to your project:

```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests
npm test
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

This is a proprietary project for CapitalMasters. For contributions or issues, please contact the development team.

## 📞 Support

For technical support or questions:
- Email: tech@capitalmasters.com
- Documentation: [Link to docs]

## 🔄 Future Enhancements

Potential features to add:
- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Email service integration (SendGrid/Mailchimp)
- [ ] Real-time portfolio updates
- [ ] Advanced analytics dashboard
- [ ] Multi-factor authentication
- [ ] Document upload functionality
- [ ] Live chat support
- [ ] Blog/News section
- [ ] Investment calculator tools
- [ ] Mobile app integration

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Built with ❤️ for CapitalMasters**

Last Updated: November 22, 2025
