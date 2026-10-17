import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const pledges = pgTable(
  "pledges",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    country: varchar("country", { length: 80 }).notNull(),
    commitment: varchar("commitment", { length: 160 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("pledges_created_idx").on(t.createdAt)],
);

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 80 }).notNull(),
  transliteration: varchar("transliteration", { length: 120 }).notNull(),
  pos: varchar("pos", { length: 40 }).notNull(),
  meaningBn: text("meaning_bn").notNull(),
  meaningEn: text("meaning_en").notNull(),
  example: text("example").notNull(),
  exampleEn: text("example_en").notNull(),
});

export const ideas = pgTable(
  "ideas",
  {
    id: serial("id").primaryKey(),
    author: varchar("author", { length: 120 }).notNull(),
    country: varchar("country", { length: 80 }).notNull(),
    body: text("body").notNull(),
    votes: integer("votes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("ideas_votes_idx").on(t.votes)],
);

export const ideaVotes = pgTable(
  "idea_votes",
  {
    id: serial("id").primaryKey(),
    ideaId: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    voterKey: varchar("voter_key", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("idea_votes_unique_idx").on(t.ideaId, t.voterKey)],
);

export type Pledge = typeof pledges.$inferSelect;
export type Word = typeof words.$inferSelect;
export type Idea = typeof ideas.$inferSelect;
