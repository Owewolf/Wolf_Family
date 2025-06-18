import { pgTable, text, serial, integer, boolean, timestamp, date, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  avatar: text("avatar").notNull(),
  color: text("color").notNull(), // Color theme for the member
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  authorId: integer("author_id").notNull().references(() => familyMembers.id),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
});

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // hero, content, posts, family, map
  title: text("title"),
  content: text("content"),
  imageUrl: text("image_url"),
  data: text("data"), // JSON string for additional data
  order: integer("order").notNull().default(0),
  pageId: text("page_id").notNull(), // home, family, posts, etc.
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightDate: date("flight_date").notNull(),
  flightNumber: text("flight_number"),
  from: text("from_airport").notNull(),
  to: text("to_airport").notNull(),
  selectedCrewPIC: text("selected_crew_pic"),
  selectedCrewSIC: text("selected_crew_sic"),
  selectedCrewRelief: text("selected_crew_relief"),
  selectedCrewStudent: text("selected_crew_student"),
  actualDepartureTime: text("actual_departure_time"),
  actualArrivalTime: text("actual_arrival_time"),
  distance: real("distance"),
  totalTime: text("total_time"),
  pic: text("pic"),
  sic: text("sic"),
  night: text("night"),
  actualInstrument: text("actual_instrument"),
  dualReceived: real("dual_received"),
  dualGiven: real("dual_given"),
  simulator: text("simulator"),
  picNight: text("pic_night"),
  sicNight: text("sic_night"),
  dualReceivedNight: integer("dual_received_night"),
  aircraftID: text("aircraft_id"),
  aircraftType: text("aircraft_type"),
  aircraftMake: text("aircraft_make"),
  aircraftModel: text("aircraft_model"),
  engineType: text("engine_type"),
  category: text("category"),
  aircraftClass: text("aircraft_class"),
  notes: text("notes")
});

export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  city: text("city"),
  country: text("country"),
  latitude: real("latitude"),
  longitude: real("longitude")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertAirportSchema = createInsertSchema(airports).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type Airport = typeof airports.$inferSelect;

// Relations
export const familyMembersRelations = relations(familyMembers, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(familyMembers, {
    fields: [posts.authorId],
    references: [familyMembers.id],
  }),
}));
