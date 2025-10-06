# 👥 Users Table Implementation - Complete Guide

## ✅ **Users Table Successfully Created**

Your Carbon Footprint Estimator now includes a comprehensive **users table** with full user profile management!

## 🗄️ **Database Schema Added**

### **Users Table Structure:**
```sql
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clerk_id" varchar(255) NOT NULL UNIQUE,
  "email" varchar(255) NOT NULL,
  "first_name" varchar(100),
  "last_name" varchar(100),
  "image_url" text,
  "preferred_transport_mode" varchar(50),
  "preferred_diet_type" varchar(50),
  "carbon_footprint_goal" numeric(10, 2),
  "notifications_enabled" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

### **Key Features:**
- **Unique Clerk ID** linking to Clerk authentication
- **User preferences** for transport and diet
- **Carbon footprint goals** for tracking progress
- **Notification preferences**
- **Automatic timestamps** for creation and updates

## 🔧 **API Endpoints Created**

### **`/api/users` (GET, POST, PUT)**
- **GET**: Fetch current user profile
- **POST**: Create or sync user profile with Clerk data
- **PUT**: Update user preferences and goals

### **`/api/webhooks/clerk` (POST)**
- Automatically creates/updates/deletes users when Clerk events occur
- Keeps local database in sync with Clerk user changes

## 📱 **New Profile Page**

### **Route: `/profile`**
A complete user profile management page with:

#### **📊 Profile Information Section:**
- Display user email, name, and account details
- Shows member since date and last updated timestamp
- Read-only information synced from Clerk

#### **⚙️ Preferences & Goals Section:**
- **Preferred Transport Mode** dropdown
- **Preferred Diet Type** selection
- **Daily Carbon Footprint Goal** input (kg CO₂)
- **Notifications toggle** for tracking reminders
- **Save functionality** with success feedback

#### **🎨 Design Features:**
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Consistent green theme
- Loading states and error handling
- Success notifications

## 🔗 **Navigation Integration**

### **Updated Navigation:**
- **Dashboard** now includes "Profile" link
- **Results page** now includes "Profile" link
- Easy navigation between all main sections

## 🚀 **Setup Instructions**

### **1. Apply Database Migration:**
```bash
# Generate migration (already done)
bun run db:generate

# Apply to your Neon database
bun run db:push
```

### **2. Configure Clerk Webhooks (Optional but Recommended):**

#### **In Clerk Dashboard:**
1. Go to "Webhooks" section
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Enable events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook signing secret to `CLERK_WEBHOOK_SECRET` in `.env.local`

#### **Benefits of Webhook Setup:**
- Automatic user creation when someone signs up
- Keeps user data in sync with Clerk
- Handles user deletions automatically

### **3. Environment Variables:**
Add to your `.env.local`:
```env
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
```

## 🎯 **User Flow**

### **New User Journey:**
1. **Sign up** via Clerk authentication
2. **Webhook automatically creates** user record (if configured)
3. **First dashboard visit** creates profile if webhook not configured
4. **Profile page** allows customization of preferences
5. **Dashboard uses preferences** for default form values
6. **History tracking** continues as before

### **Existing User Benefits:**
- **Profile customization** for better UX
- **Goal setting** for carbon footprint targets
- **Preference storage** for faster form filling
- **Notification controls** for tracking reminders

## 📊 **Data Relationships**

### **Users ↔ History Connection:**
- `users.clerk_id` links to `user_history.user_id`
- Each history entry belongs to a specific user
- User preferences can influence form defaults
- Goal tracking against actual carbon footprint

## 🔒 **Security Features**

### **Authentication & Authorization:**
- All API routes require Clerk authentication
- Users can only access their own data
- Clerk ID ensures proper user isolation
- Input validation on all endpoints

### **Data Privacy:**
- Sensitive data stored in Clerk (passwords, etc.)
- Local database only stores preferences and goals
- Webhook endpoints secured with signing secrets

## 🚀 **Future Enhancement Opportunities**

### **Potential Additions:**
- **Dashboard widgets** showing progress toward goals
- **Achievement system** for reaching targets
- **Social features** for sharing progress
- **Email notifications** for goal reminders
- **Advanced analytics** with goal comparisons
- **Export functionality** for personal data

## 📈 **Usage Examples**

### **Creating/Updating User Profile:**
```typescript
// Automatic creation on sign-up (via webhook)
// Or manual via dashboard when user first visits

// Update preferences
const response = await fetch('/api/users', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    preferredTransportMode: 'bike',
    preferredDietType: 'vegan',
    carbonFootprintGoal: 8.5,
    notificationsEnabled: true
  })
});
```

### **Fetching User Profile:**
```typescript
const response = await fetch('/api/users');
const userProfile = await response.json();
```

## ✅ **Verification Steps**

### **Test Your Implementation:**
1. **Sign up** a new user
2. **Visit `/profile`** page
3. **Set preferences** and goals
4. **Save changes** and verify success message
5. **Return to dashboard** and see if preferences are used
6. **Check database** to confirm data storage

## 🎉 **Implementation Complete!**

Your **users table** is now fully integrated with:
- ✅ **Complete database schema**
- ✅ **API endpoints for user management**
- ✅ **Profile page for user preferences**
- ✅ **Webhook integration for automatic user sync**
- ✅ **Navigation updates**
- ✅ **Security and validation**

**Your Carbon Footprint Estimator now has comprehensive user profile management! 🌟**