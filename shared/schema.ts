import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Users Schema (Authentication) ---
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Stores the bcrypt hash
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// --- Persons Schema (Family Members) ---

// Defining the JSON structure for side relations as requested: sideRelations: [{id, relationType}]
export const sideRelationSchema = z.object({
    id: z.string().uuid(),
    relationType: z.string(), // e.g., "زوج الابنة", "صديق العائلة"
});

export type SideRelation = z.infer<typeof sideRelationSchema>;

export const persons = pgTable("persons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age"),
  residence: text("residence"),
  occupation: text("occupation"),
  bio: text("bio"),
  whatsapp: text("whatsapp"), // Sensitive data
  role: varchar("role", { enum: ["admin", "user", "none"] }).notNull().default("none"),
  
  // Relations: pointing to other persons' IDs
  fatherId: varchar("father_id"),
  motherId: varchar("mother_id"),
  spouseId: varchar("spouse_id"),

  // Complex relations storage (jsonb for flexible schema as requested)
  sideRelations: jsonb("side_relations").$type<SideRelation[]>().default([]),

  // Audit/User fields for the person record
  username: text("username").unique(), // Corresponds to a login account if role is not 'none'
  passwordHash: text("password_hash"), // Stores the bcrypt hash of the person's password
  
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertPersonSchema = createInsertSchema(persons, {
    age: z.coerce.number().int().positive().optional(),
    // Allow empty strings for optional fields from form, which we'll convert to undefined/null in the API layer
    residence: z.string().optional().or(z.literal("")), 
    occupation: z.string().optional().or(z.literal("")), 
    bio: z.string().optional().or(z.literal("")), 
    whatsapp: z.string().optional().or(z.literal("")),
    fatherId: z.string().optional().or(z.literal("")), 
    motherId: z.string().optional().or(z.literal("")), 
    spouseId: z.string().optional().or(z.literal("")),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    passwordHash: true, // Handled internally on create/update
    username: true, // Handled internally on create/update
}).extend({
    // Adding optional password/username fields for form submission
    newUsername: z.string().optional(),
    newPassword: z.string().optional(),
    id: z.string().optional(), // For updates
});

export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof persons.$inferSelect & {
    newUsername?: string; // Optional field for form input
    newPassword?: string; // Optional field for form input
};
