# 🌱 Carbon Footprint Estimator

A full-stack Next.js web application that estimates users' daily carbon footprint based on their lifestyle choices. The app integrates with a Python FastAPI endpoint for AI-powered predictions and provides a clean, responsive interface for tracking environmental impact.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Next.js API routes, Drizzle ORM, Neon PostgreSQL
- **Authentication:** Clerk
- **Package Manager:** Bun
- **External Integration:** FastAPI endpoint for carbon footprint predictions

## ✨ Features

- 🔐 **Secure Authentication** with Clerk
- 📊 **AI-Powered Predictions** via FastAPI integration
- 📈 **Historical Tracking** of carbon footprint calculations
- 📱 **Responsive Design** with modern UI/UX
- 🎨 **Smooth Animations** powered by Framer Motion
- 🗄️ **Persistent Storage** with Neon PostgreSQL

## 🛠️ Installation & Setup

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) account for authentication

### 1. Clone & Install Dependencies

```bash
cd carbon-footprint-estimator
bun install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Fill in your actual values in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# FastAPI Model Endpoint (optional - uses fallback if not available)
FASTAPI_MODEL_URL=https://your-fastapi-endpoint.com
```

### 3. Database Setup

Generate and run database migrations:

```bash
# Generate migration files
bun run db:generate

# Push schema to database
bun run db:push
```

### 4. Clerk Configuration

1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.com/)
2. Configure the following redirect URLs:
   - **Sign-in redirect:** `http://localhost:3000/dashboard`
   - **Sign-up redirect:** `http://localhost:3000/dashboard`
   - **Home URL:** `http://localhost:3000`
3. Copy your publishable and secret keys to `.env.local`

### 5. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── api/
│   │   ├── predict/route.ts
│   │   └── history/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── dashboard/page.tsx
│   ├── results/page.tsx
│   ├── layout.tsx
│   └── page.tsx (Landing page)
├── lib/
│   └── db/
│       ├── index.ts
│       └── schema.ts
└── middleware.ts
```

## 🎯 Key Features Walkthrough

### 1. Landing Page
- Clean hero section with project overview
- Feature highlights with icons and descriptions
- Call-to-action buttons for user registration

### 2. Authentication
- Seamless sign-up/sign-in with Clerk
- Protected routes with middleware
- Automatic redirection after authentication

### 3. Dashboard
- Input form for lifestyle data:
  - Transport mode (car, bus, train, bike)
  - Daily distance traveled
  - Diet type (vegan, vegetarian, mixed)
  - Daily electricity usage
  - Daily waste generation
- Real-time carbon footprint calculation
- Eco-friendly tips and recommendations

### 4. Results Page
- Historical data visualization
- Statistics: average, most recent, total calculations
- Data management: delete individual entries or clear all
- Responsive table with detailed breakdown

## 🔌 API Integration

### FastAPI Endpoint Integration

The app sends POST requests to a FastAPI endpoint with the following structure:

```json
{
  "transport_mode": "car",
  "km_per_day": 25.5,
  "diet_type": "mixed",
  "electricity_kWh_per_day": 15.2,
  "waste_kg_per_day": 2.5
}
```

Expected response:
```json
{
  "carbon_footprint": 14.27
}
```

### Fallback Calculation

If the FastAPI endpoint is unavailable, the app uses a built-in fallback calculation based on standard emission factors.

## 🗄️ Database Schema

The application uses a single table for storing user history:

```sql
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  transport_mode VARCHAR(50) NOT NULL,
  km_per_day NUMERIC(10,2) NOT NULL,
  diet_type VARCHAR(50) NOT NULL,
  electricity_kwh_per_day NUMERIC(10,2) NOT NULL,
  waste_kg_per_day NUMERIC(10,2) NOT NULL,
  predicted_carbon_footprint NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev          # Start development server with Turbopack

# Production
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:generate  # Generate migration files
bun run db:push      # Push schema changes to database
bun run db:migrate   # Run migrations
bun run db:studio    # Open Drizzle Studio

# Code Quality
bun run lint         # Run ESLint
```

## 🎨 Styling & Design

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography
- **Green color scheme** reflecting environmental theme
- **Mobile-first responsive design**

## 🔒 Security Features

- **Authentication required** for all dashboard and API routes
- **User isolation** - users can only access their own data
- **Input validation** on both client and server sides
- **Protected API routes** with Clerk authentication

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

- Clerk keys (production values)
- Neon database URL (production database)
- FastAPI endpoint URL (if available)

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the environment variables are correctly set
2. Ensure database connection is working
3. Verify Clerk configuration
4. Check console for error messages

For additional help, please open an issue in the repository.

---

**Made with 💚 for a sustainable future**
