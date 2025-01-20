import { db, groups, teachers } from "@src/db";
import { eq } from "drizzle-orm";

export const pushGroups = async (data: { route: string, course: string }[]) => {
    try {
        await db
            .insert(groups)
            .values(data)
    } catch (e) {
        console.log(e);
    }
}

export const pushTeachers = async (data: { initials: string }[]) => {
    try {
        await db
            .insert(teachers)
            .values(data)
            .onConflictDoNothing();
    } catch (e) {
        console.log(e);
    }
}