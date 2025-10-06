import { pgTable, uuid, varchar, numeric, timestamp, text, boolean } from 'drizzle-orm/pg-core';

// Users table to store user profile information
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  imageUrl: text('image_url'),
  preferredTransportMode: varchar('preferred_transport_mode', { length: 50 }),
  preferredDietType: varchar('preferred_diet_type', { length: 50 }),
  carbonFootprintGoal: numeric('carbon_footprint_goal', { precision: 10, scale: 2 }),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User history table to store carbon footprint calculations
export const userHistory = pgTable('user_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  transportMode: varchar('transport_mode', { length: 50 }).notNull(),
  kmPerDay: numeric('km_per_day', { precision: 10, scale: 2 }).notNull(),
  dietType: varchar('diet_type', { length: 50 }).notNull(),
  electricityKwhPerDay: numeric('electricity_kwh_per_day', { precision: 10, scale: 2 }).notNull(),
  wasteKgPerDay: numeric('waste_kg_per_day', { precision: 10, scale: 2 }).notNull(),
  predictedCarbonFootprint: numeric('predicted_carbon_footprint', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserHistory = typeof userHistory.$inferSelect;
export type NewUserHistory = typeof userHistory.$inferInsert;