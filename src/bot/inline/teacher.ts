import { db, teachers_lessons } from "@db/index";
import { genTeacherScheduleText } from "@src/services/user/menu";
import { and, eq } from "drizzle-orm";
import {
    InlineQueryContext,
    InlineQueryResult,
    InputMessageContent,
    type BotLike
} from "gramio";


export const shareTeacherSchedule = async (
    ctx: InlineQueryContext<BotLike>,
    toDayDate: string,
    nextDayDate: string,
    teacherInitials: string,
    teacherId: number,
) => {

    const lessonsToDay = await db
        .select()
        .from(teachers_lessons)
        .where(
            and(
                eq(teachers_lessons.teacher, teacherId),
                eq(teachers_lessons.date, toDayDate)
            )
        );

    const lessonsNextDay = await db
        .select()
        .from(teachers_lessons)
        .where(
            and(
                eq(teachers_lessons.teacher, teacherId),
                eq(teachers_lessons.date, nextDayDate)
            )
        );

    const textToDay = await genTeacherScheduleText(
        lessonsToDay,
        String(teacherInitials),
        toDayDate
    );

    const textNextDay = await genTeacherScheduleText(
        lessonsNextDay,
        String(teacherInitials),
        nextDayDate
    );

    return ctx.answer(
        [
            InlineQueryResult.article(
                "id=1",
                "Расписание на сегодня",
                InputMessageContent.text("📚 Моё расписание на <b>сегодня</b>:\n\n" + textToDay, {
                    parse_mode: "HTML",
                }),
            ),
            InlineQueryResult.article(
                "id=2",
                "Расписание на завтра",
                InputMessageContent.text("📚 Моё расписание на <b>завтра</b>:\n\n" + textNextDay, {
                    parse_mode: "HTML",
                }),
            ),
        ],
        {
            cache_time: 0,
        },
    )
}