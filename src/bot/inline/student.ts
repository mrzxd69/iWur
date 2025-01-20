import {
    InlineQueryContext,
    InlineQueryResult,
    InputMessageContent,
    type BotLike
} from "gramio";
import { and, asc, eq } from "drizzle-orm";
import { db, lessons, teachers } from "@db/index";
import { genStudentScheduleText } from "@src/services/user/menu";

export const shareStudentSchedule = async (
    ctx: InlineQueryContext<BotLike>,
    toDayDate: string,
    nextDayDate: string,
    group: string
) => {
    const lessonsToDay = await db
        .select()
        .from(lessons)
        .leftJoin(teachers, eq(teachers.id, lessons.teacher))
        .where(
            and(
                eq(lessons.group, group),
                eq(lessons.date, toDayDate)
            )
        )
        .orderBy(
            asc(lessons.count),
            asc(lessons.status)
        );

    const lessonsNextDay = await db
        .select()
        .from(lessons)
        .leftJoin(teachers, eq(teachers.id, lessons.teacher))
        .where(
            and(
                eq(lessons.group, group),
                eq(lessons.date, nextDayDate)
            )
        )
        .orderBy(
            asc(lessons.count),
            asc(lessons.status)
        );

    const textToDay = await genStudentScheduleText(
        lessonsToDay,
        group,
        toDayDate
    );

    const textNextDay = await genStudentScheduleText(
        lessonsNextDay,
        group,
        nextDayDate
    );

    return ctx.answer(
        [
            InlineQueryResult.article(
                "id=1",
                "Расписание на сегодня",
                InputMessageContent.text(textToDay, {
                    parse_mode: "HTML",
                }),
            ),
            InlineQueryResult.article(
                "id=2",
                "Расписание на завтра",
                InputMessageContent.text(textNextDay, {
                    parse_mode: "HTML",
                }),
            ),
        ],
        {
            cache_time: 0,
        },
    );
}