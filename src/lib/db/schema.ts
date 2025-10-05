import { pgTable, uuid, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

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

export type UserHistory = typeof userHistory.$inferSelect;
export type NewUserHistory = typeof userHistory.$inferInsert;