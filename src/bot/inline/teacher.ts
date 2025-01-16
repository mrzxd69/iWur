import { bot } from "@bot/instance";
import { db, teachers, teachers_lessons, users } from "@db/index";
import { format } from "@formkit/tempo";
import { genTeacherScheduleText } from "@src/services/user/menu";
import { and, eq } from "drizzle-orm";
import { InlineKeyboard, InlineQueryResult, InputMessageContent } from "gramio";


export const shareSchedule = () =>
    bot.inlineQuery(/send/i, async ctx => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.telegram_id, ctx.from.id))
            .innerJoin(teachers, eq(teachers.id, users.teacher));

        if (!user) return ctx.answer(
            [
                InlineQueryResult.article("id=1", "Авторизуйтесь в боте", InputMessageContent.text("Для получения расписания нужна авторизация в системе"), {
                    reply_markup: new InlineKeyboard().url("⭐️ Перейти в бота ⭐️", "https://t.me/iwurbot"),
                }),
            ],
            {
                cache_time: 0,
            }
        )

        const date = new Date();

        const toDayDate = format({
            date: date,
            format: "DD.MM",
            tz: "Asia/Omsk",
        })

        date.setDate(new Date().getDate() + 1);

        const nextDayDate = format({
            date: date,
            format: "DD.MM",
            tz: "Asia/Omsk",
        })

        const lessonsToDay = await db
            .select()
            .from(teachers_lessons)
            .where(
                and(
                    eq(teachers_lessons.teacher, user.users.id),
                    eq(teachers_lessons.date, toDayDate)
                )
            );

        const lessonsNextDay = await db
            .select()
            .from(teachers_lessons)
            .where(
                and(
                    eq(teachers_lessons.teacher, user.users.id),
                    eq(teachers_lessons.date, nextDayDate)
                )
            );
        console.log(123)
        const textToDay = genTeacherScheduleText(
            lessonsToDay,
            String(user.teachers.initials),
            toDayDate
        );

        const textNextDay = genTeacherScheduleText(
            lessonsNextDay,
            String(user.teachers.initials),
            nextDayDate
        );

        return ctx.answer(
            [
                InlineQueryResult.article(
                    "id=1",
                    "Расписание на сегодня",
                    InputMessageContent.text("📚 Моё расписание на <b>сегодня</b>:\n" + textToDay, {
                        parse_mode: "HTML",
                    }),
                ),
                InlineQueryResult.article(
                    "id=2",
                    "Расписание на завтра",
                    InputMessageContent.text("📚 Моё расписание на <b>завтра</b>:\n" + textNextDay, {
                        parse_mode: "HTML",
                    }),
                ),
            ],
            {
                cache_time: 0,
            },
        )
    });