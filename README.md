# 🌱 Carbon Footprint Estimator

A comprehensive full-stack web application that estimates users' daily carbon footprint based on their lifestyle choices. Built with modern technologies and featuring a custom-trained machine learning model for accurate carbon emission predictions.

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### **Backend** 
- **Next.js API Routes** for main application logic
- **Flask API** (Dockerized) for ML predictions
- **Drizzle ORM** for database operations
- **Neon PostgreSQL** for data storage

### **Authentication & Infrastructure**
- **Clerk** for user authentication and management
- **Docker** for ML API containerization
- **Bun** as package manager
- **Custom ML Model** (scikit-learn RandomForestRegressor)

## ✨ Features

### 🎯 **Core Functionality**
- 🤖 **AI-Powered Predictions** using custom-trained RandomForestRegressor model
- 📊 **Real-time Carbon Footprint Calculation** based on user inputs
- 📈 **Historical Data Tracking** with comprehensive analytics
- 🎨 **Interactive Dashboard** with eco-friendly tips and insights

### 🔐 **User Management**
- 🔑 **Secure Authentication** with Clerk (sign up, sign in, profile management)
- 👤 **User Profiles** with personal preferences and goals
- 🗂️ **Personal Data Management** (view, export, delete history)

### 🌐 **Technical Features**
- 📱 **Fully Responsive Design** (mobile-first approach)
- ⚡ **Fast Performance** with Next.js 15 and Turbopack
- 🎭 **Smooth Animations** powered by Framer Motion
- 🐳 **Dockerized ML API** for scalable predictions
- 🔒 **Protected Routes** with middleware-based authentication
- 📊 **Data Visualization** with statistics and trends

### 📋 **Input Parameters**
- 🚗 **Transportation Mode**: Car, Bus, Train, Bike, Walking
- 📏 **Daily Distance**: Kilometers traveled per day
- 🥗 **Diet Type**: Vegan, Vegetarian, Mixed
- ⚡ **Electricity Usage**: kWh consumed per day
- 🗑️ **Waste Generation**: Kilograms of waste per day

## 🛠️ Installation & Setup

### Prerequisites

- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager
- **[Docker](https://docker.com/)** - For running the ML API container
- **[Neon](https://neon.tech/)** - PostgreSQL database (or any PostgreSQL instance)
- **[Clerk](https://clerk.com/)** - Authentication service account

### 🚀 Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/roht2103/carbon-footprint-estimator.git
cd carbon-footprint-estimator
```

#### 2. Install Dependencies
```bash
bun install
```

#### 3. Environment Setup
Copy the environment template and fill in your values:
```bash
cp .env.example .env.local
```

**Required Environment Variables (.env.local):**
```env
# Clerk Authentication (Get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Get from https://neon.tech or your PostgreSQL provider)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# ML API URL (default: http://localhost:5000 for local development)
FASTAPI_MODEL_URL=http://localhost:5000
```

#### 4. Database Setup
```bash
# Generate and apply database migrations
bun run db:push

# (Optional) Open database studio to view tables
bun run db:studio
```

#### 5. Start the ML API (Docker)
```bash
# Navigate to ML API directory
cd ml-api

# Start the Docker container with your trained model
docker compose up -d

# Verify the API is running
curl http://localhost:5000/health
```

#### 6. Start the Development Server
```bash
# Return to project root and start Next.js
cd ..
bun run dev
```

🎉 **Your application is now running at:** [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
carbon-footprint-estimator/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx           # Root layout with Clerk provider
│   │   ├── 📄 page.tsx             # Landing page
│   │   ├── 📄 globals.css          # Global styles
│   │   ├── 📁 (auth)/              # Authentication pages
│   │   │   ├── 📁 sign-in/[[...sign-in]]/
│   │   │   └── 📁 sign-up/[[...sign-up]]/
│   │   ├── 📁 api/                 # API routes
│   │   │   ├── 📁 predict/         # Carbon footprint prediction
│   │   │   ├── 📁 history/         # User history management
│   │   │   ├── 📁 users/           # User profile management
│   │   │   └── 📁 webhooks/        # Clerk webhooks
│   │   ├── 📁 dashboard/           # Main calculator interface
│   │   ├── 📁 results/             # Historical data & analytics
│   │   └── 📁 profile/             # User profile management
│   ├── 📁 lib/
│   │   └── 📁 db/
│   │       ├── 📄 index.ts         # Database connection
│   │       └── 📄 schema.ts        # Database schema (Drizzle)
│   └── 📄 middleware.ts            # Route protection
├── 📁 ml-api/                      # Dockerized ML API
│   ├── 📄 app.py                   # Flask application
│   ├── 📄 carbon_model.pkl         # Trained ML model
│   ├── 📄 Dockerfile              # Container configuration
│   ├── 📄 docker-compose.yml      # Docker services
│   ├── 📄 requirements.txt        # Python dependencies
│   └── 📄 .dockerignore           # Docker ignore rules
├── 📁 drizzle/                     # Database migrations
├── 📁 public/                      # Static assets
├── 📄 package.json                # Node.js dependencies
├── 📄 next.config.mjs             # Next.js configuration
├── 📄 tailwind.config.ts          # Tailwind CSS configuration
├── 📄 drizzle.config.ts           # Database configuration
└── 📄 .env.local                  # Environment variables
```

## 🎯 Application Walkthrough

### 🏠 **Landing Page** (`/`)
- **Hero Section**: Eye-catching introduction with environmental focus
- **Features Overview**: Highlight key capabilities with icons
- **Call-to-Action**: Sign up/Sign in buttons leading to authentication

### 🔐 **Authentication** (`/sign-in`, `/sign-up`)
- **Clerk Integration**: Seamless user registration and login
- **Protected Routes**: Automatic redirection for authenticated users
- **Social Logins**: Support for multiple authentication providers

### 📊 **Dashboard** (`/dashboard`) - *Protected Route*
- **Carbon Calculator Form**:
  - Transportation mode selection (car, bus, train, bike, walking)
  - Daily distance input with validation
  - Diet type selection (vegan, vegetarian, mixed)
  - Electricity usage input (kWh per day)
  - Waste generation input (kg per day)
- **Real-time Predictions**: Instant carbon footprint calculation
- **Eco Tips**: Personalized recommendations for reducing carbon footprint
- **Data Persistence**: Automatic saving to user history

### 📈 **Results Page** (`/results`) - *Protected Route*
- **Historical Data Table**: Comprehensive view of all calculations
- **Statistics Dashboard**:
  - Average carbon footprint
  - Most recent calculation
  - Total number of calculations
  - Trend analysis
- **Data Management**: Delete individual entries or clear all data
- **Export Functionality**: Download data for external analysis

### 👤 **Profile Page** (`/profile`) - *Protected Route*
- **User Information**: Display and edit profile details
- **Account Settings**: Preferences and configurations
- **Data Management**: Privacy controls and data export options

## 🔌 ML API Integration

### **Flask API Endpoints**

#### `GET /health`
Health check endpoint to verify API status:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "Carbon Footprint Prediction API is running"
}
```

#### `POST /predict`
Main prediction endpoint for carbon footprint calculation:

**Request Body:**
```json
{
  "transport_mode": "car",
  "km_per_day": 25.0,
  "diet_type": "mixed",
  "electricity_kWh_per_day": 12.0,
  "waste_kg_per_day": 2.5
}
```

**Response:**
```json
{
  "carbon_footprint": 9.47,
  "input_features": {
    "transport_mode": "car",
    "km_per_day": 25.0,
    "diet_type": "mixed",
    "electricity_kWh_per_day": 12.0,
    "waste_kg_per_day": 2.5
  },
  "status": "success"
}
```

### **Model Details**
- **Algorithm**: RandomForestRegressor (scikit-learn 1.6.1)
- **Training Features**: Transport mode, distance, diet type, electricity usage, waste generation
- **Output**: Daily carbon footprint in kg CO2 equivalent
- **Containerization**: Docker with Python 3.11 for consistency

## 🗄️ Database Schema

The application uses **Neon PostgreSQL** with **Drizzle ORM** for type-safe database operations.

### **Tables**

#### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_history` Table
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

### **Relationships**
- `user_history.user_id` references `users.clerk_id`
- Each user can have multiple history entries
- Automatic timestamps for data tracking

## 🛠️ Available Scripts

### **Development**
```bash
bun run dev              # Start development server with Turbopack
bun run build            # Build application for production
bun run start            # Start production server
bun run lint             # Run ESLint for code quality
```

### **Database Operations**
```bash
bun run db:generate      # Generate new migration files
bun run db:push          # Push schema changes to database
bun run db:migrate       # Run pending migrations
bun run db:studio        # Open Drizzle Studio (database GUI)
```

### **Docker/ML API**
```bash
# From ml-api directory
docker compose up -d     # Start ML API container
docker compose down      # Stop ML API container
docker compose logs      # View container logs
docker compose build    # Rebuild container
```

## 🎨 Design & Styling

### **Visual Design**
- 🎨 **Color Palette**: Green-focused environmental theme
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✨ **Animations**: Smooth transitions with Framer Motion
- 🎯 **Icons**: Consistent Lucide React iconography
- 🌙 **Typography**: Clean, readable font hierarchy

### **User Experience**
- ⚡ **Fast Loading**: Optimized with Next.js 15 and Turbopack
- 🎭 **Interactive Elements**: Hover effects and micro-interactions
- 📊 **Data Visualization**: Clear charts and statistics
- 🎪 **Feedback Systems**: Loading states and success notifications

## 🔒 Security & Privacy

### **Authentication Security**
- 🔐 **Clerk Integration**: Industry-standard authentication
- 🛡️ **Protected Routes**: Middleware-based route protection
- 🔑 **Session Management**: Secure session handling
- 👤 **User Isolation**: Users can only access their own data

### **Data Protection**
- 🏗️ **Input Validation**: Client and server-side validation
- 🚫 **SQL Injection Prevention**: Drizzle ORM query protection
- 🔒 **Environment Variables**: Secure credential management
- 🌐 **HTTPS Ready**: Production-ready security headers

## 🚀 Deployment Guide

### **Prerequisites for Production**
- Neon PostgreSQL database (production instance)
- Clerk application (production keys)
- Docker container registry (for ML API)
- Domain name and SSL certificate

### **Vercel Deployment** (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel Setup**
   - Connect your GitHub repository to Vercel
   - Import the project
   - Configure environment variables in Vercel dashboard

3. **Environment Variables for Production**
   ```env
   # Clerk (Production keys)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   
   # Database (Production instance)
   DATABASE_URL=postgresql://...
   
   # ML API (Production URL)
   FASTAPI_MODEL_URL=https://your-ml-api.com
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Database migrations will run automatically

### **ML API Deployment Options**

#### Option 1: Cloud Run (Google Cloud)
```bash
# Build and push to Google Container Registry
docker build -t gcr.io/your-project/carbon-ml-api ./ml-api
docker push gcr.io/your-project/carbon-ml-api

# Deploy to Cloud Run
gcloud run deploy carbon-ml-api \
  --image gcr.io/your-project/carbon-ml-api \
  --platform managed \
  --port 5000
```

#### Option 2: Railway
```bash
# Install Railway CLI and deploy
railway login
railway link
railway up
```

#### Option 3: Digital Ocean App Platform
- Create new app from Docker image
- Connect to your repository
- Configure environment variables
- Deploy automatically

## 🧪 Testing the Application

### **Local Testing**
```bash
# Test ML API health
curl http://localhost:5000/health

# Test prediction endpoint
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "transport_mode": "car",
    "km_per_day": 25,
    "diet_type": "mixed",
    "electricity_kWh_per_day": 12,
    "waste_kg_per_day": 2.5
  }'

# Test Next.js application
# Visit http://localhost:3000 and test all features
```

### **Production Testing**
- ✅ Authentication flow (sign up, sign in, sign out)
- ✅ Carbon footprint calculation
- ✅ Data persistence and retrieval
- ✅ Responsive design across devices
- ✅ ML API connectivity and predictions

## 🤝 Contributing

We welcome contributions to make this carbon footprint estimator even better! Here's how you can help:

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   # Click the Fork button on GitHub
   git clone https://github.com/YOUR_USERNAME/carbon-footprint-estimator.git
   cd carbon-footprint-estimator
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   # or
   git checkout -b bugfix/fix-important-bug
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   bun run lint           # Check code quality
   bun run build          # Ensure build works
   bun run dev            # Test locally
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   git push origin feature/amazing-new-feature
   ```

6. **Create Pull Request**
   - Go to GitHub and create a pull request
   - Describe your changes clearly
   - Link any related issues

### **Development Guidelines**

- **Code Style**: Follow the existing TypeScript/React patterns
- **Commits**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Test your changes thoroughly before submitting
- **Documentation**: Update README.md if you add new features

### **Areas for Contribution**

- 🌟 **New Features**: Additional carbon footprint factors, data visualization improvements
- 🐛 **Bug Fixes**: Report and fix any issues you encounter
- 📚 **Documentation**: Improve setup guides, add tutorials
- 🎨 **UI/UX**: Design improvements, accessibility enhancements
- ⚡ **Performance**: Optimization opportunities
- 🧪 **Testing**: Add unit tests, integration tests

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Carbon Footprint Estimator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🆘 Troubleshooting & Support

### **Common Issues**

#### 🔧 **Environment Variables**
```bash
# If authentication isn't working
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  # Should not be empty
echo $CLERK_SECRET_KEY                   # Should not be empty

# If database connection fails
bun run db:studio  # Test database connectivity
```

#### 🐳 **Docker Issues**
```bash
# If ML API container won't start
docker compose logs                      # Check container logs
docker compose down && docker compose up --build -d  # Rebuild

# If model loading fails
docker exec -it carbon-footprint-ml-api python -c "import pickle; print('OK')"
```

#### 🌐 **API Connection Issues**
```bash
# Test ML API connectivity
curl http://localhost:5000/health

# Check Next.js API routes
curl http://localhost:3000/api/predict
```

### **Getting Help**

1. **Check Issues**: Look through [GitHub Issues](https://github.com/roht2103/carbon-footprint-estimator/issues) for similar problems
2. **Create Issue**: If you can't find a solution, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)
3. **Join Discussions**: Participate in [GitHub Discussions](https://github.com/roht2103/carbon-footprint-estimator/discussions)

### **Debugging Steps**

1. ✅ **Verify Environment Variables**: Check all required variables are set
2. ✅ **Database Connection**: Ensure Neon database is accessible
3. ✅ **Clerk Configuration**: Verify authentication settings
4. ✅ **Docker Status**: Confirm ML API container is running
5. ✅ **Network Connectivity**: Test API endpoints manually
6. ✅ **Browser Console**: Check for JavaScript errors
7. ✅ **Server Logs**: Review Next.js and Docker logs

---

## 🌟 Acknowledgments

- **[Clerk](https://clerk.com/)** for seamless authentication
- **[Neon](https://neon.tech/)** for serverless PostgreSQL
- **[Vercel](https://vercel.com/)** for hosting and deployment
- **[Drizzle](https://orm.drizzle.team/)** for type-safe database operations
- **[Bun](https://bun.sh/)** for fast package management
- **[Tailwind CSS](https://tailwindcss.com/)** for utility-first styling
- **[Next.js](https://nextjs.org/)** for the amazing React framework

---

<div align="center">

**🌱 Made with 💚 for a Sustainable Future 🌍**

[⭐ Star this repo](https://github.com/roht2103/carbon-footprint-estimator) | [🐛 Report Bug](https://github.com/roht2103/carbon-footprint-estimator/issues) | [💡 Request Feature](https://github.com/roht2103/carbon-footprint-estimator/issues)

**Help us build a greener tomorrow, one calculation at a time! 🌿**

</div>
