import { eq } from "drizzle-orm";
import {
    InlineKeyboard,
    InlineQueryResult,
    InputMessageContent
} from "gramio";
import { format } from "@formkit/tempo";
import { bot } from "@bot/instance";
import { db, groups, teachers, users } from "@db/index";
import { shareTeacherSchedule } from "./teacher";
import { shareStudentSchedule } from "./student";

export const shareSchedule = () =>
    bot.inlineQuery(/send/i, async ctx => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.telegram_id, ctx.from.id))

        if (!user) return ctx.answer(
            [
                InlineQueryResult.article("id=1", "Авторизуйтесь в боте", InputMessageContent.text("Для получения расписания нужна авторизация в системе"), {
                    reply_markup: new InlineKeyboard().url("⭐️ Перейти в бота ⭐️", "https://t.me/iwurbot"),
                }),
            ],
            {
                cache_time: 0,
            }
        );

        const date = new Date();

        const toDayDate = format({
            date: date,
            format: "DD.MM",
            tz: "Asia/Omsk",
        });

        date.setDate(new Date().getDate() + 1);

        const nextDayDate = format({
            date: date,
            format: "DD.MM",
            tz: "Asia/Omsk",
        });

        if (user?.teacher) {
            const [teacher] = await db
                .select()
                .from(teachers)
                .where(eq(teachers.id, user.teacher));

            if (!teacher.id || !teacher.initials) throw new Error(
                "Преподаватель отсутствует в системе"
            );

            return shareTeacherSchedule(
                ctx,
                toDayDate,
                nextDayDate,
                teacher.initials,
                teacher.id
            )
        }

        if (user?.group) {
            const [group] = await db
                .select()
                .from(groups)
                .where(eq(groups.id, user.group));

            if (!group.course || !group.route) throw new Error(
                "Ваша группа отсутствует в системе"
            );

            return shareStudentSchedule(
                ctx,
                toDayDate,
                nextDayDate,
                String(group.route + group.course)
            )
        }
    });