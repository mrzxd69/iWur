import { relations, type InferSelectModel } from "drizzle-orm";
import {
    pgTable,
    integer,
    bigint,
    text,
    boolean,
    smallint
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    telegram_id: bigint({ mode: "number" }).notNull(),
    ban: boolean().notNull().default(false),
    teacher: integer().references(() => teachers.id, {
        onDelete: "no action"
    }),
    group: integer().references(() => groups.id, {
        onDelete: "no action"
    })
});

export const settings = pgTable("settings", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    notification_schedule: boolean().notNull().default(true),
    notification_news: boolean().notNull().default(true),
    user_id: integer().notNull().references(() => users.id, {
        onDelete: "cascade"
    })
});

export const teachers = pgTable("teachers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    initials: text().unique()
});

export const groups = pgTable("groups", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    route: text(),
    course: text().unique()
});

export const teachers_lessons = pgTable("teachers_lessons", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    teacher: integer().references(() => teachers.id, {
        onDelete: "set null"
    }),
    count: smallint(),
    date: text(),
    room: text(),
    group: text(),
});

export const lessons = pgTable("lessons", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    group: text(),
    count: smallint(),
    lesson: text(),
    status: text({ enum: ["Joined", "SubGroup1", "SubGroup2"] }),
    date: text(),
    room: text(),
    teacher: integer().references(() => teachers.id, {
        onDelete: "set null"
    })
});


export type TLesson = InferSelectModel<typeof lessons>;
export type TUser = InferSelectModel<typeof users>;
export type TGroup = InferSelectModel<typeof groups>;
export type TTeacher = InferSelectModel<typeof teachers>;
export type TLessonsTeacher = InferSelectModel<typeof teachers_lessons>;
export type TSettings = InferSelectModel<typeof settings>;