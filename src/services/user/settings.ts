import { db } from "@db/index";
import { settings, users } from "@db/schema";
import { eq } from "drizzle-orm";

export const getSettingsParams = async (id: number) => {
    const userId = await db
        .select()
        .from(users)
        .where(eq(users.telegram_id, id));

    if (!userId[0]) {
        throw new Error("Вы не авторизованы в системе");
    }

    const userSettings = await db
        .select()
        .from(settings)
        .where(eq(settings.user_id, userId[0].id));

    return userSettings[0];
}


export const editNotice = async (typeNotice: "schedule" | "news", id: number) => {

    const [{ id: userId }] = await db
        .select()
        .from(users)
        .where(eq(users.telegram_id, id));

    const currentSettings = await db
        .select()
        .from(settings)
        .where(eq(settings.user_id, userId));

    if (!userId) {
        throw new Error("Вы не авторизованы в системе");
    }

    if (typeNotice === "schedule") {
        return db
            .update(settings)
            .set({ notification_schedule: !currentSettings[0].notification_schedule })
            .where(eq(settings.user_id, userId))
            .returning({
                notification_schedule: settings.notification_schedule,
                notification_news: settings.notification_news
            });
    } else {
        return db
            .update(settings)
            .set({ notification_news: !currentSettings[0].notification_news })
            .where(eq(settings.user_id, userId))
            .returning({
                notification_schedule: settings.notification_schedule,
                notification_news: settings.notification_news
            });
    }
}