import { and, eq } from "drizzle-orm"
import { db, lessons } from "@db/index"
import { getDefineDate } from "@services/date";

export namespace StudentTextBuilder {
    export const generateTitleText = async (group: string, date: string) => {
        const [existsLessons] = await db
            .select()
            .from(lessons)
            .where(and(
                eq(lessons.group, group),
                eq(lessons.date, date)
            ));

        return existsLessons
            ? `📚 ИЗМЕНЕНИЯ РАСПИСАНИЯ\n\n🖇 <b>Группа: </b> ${group}\n⏳ <b>Дата: </b> ${getDefineDate(date)}\n`
            : `🖇 <b>Группа: </b> ${group}\n⏳ <b>Дата: </b> ${getDefineDate(date)}\n`;
    }

    export const certainLessonOnlyOneSubGroup = (
        lesson: string,
        descipline: string,
        room: string,
        subgroup: string,
        teacher: string | null
    ) => {
        const teacherName = teacher ? ` | <i>${teacher}</i>` : "";

        return `\n<b>${lesson} пара:</b>\n  ${descipline}\n   [${subgroup}] - <b>${room || "не указан"}</b>${teacherName}\n`;
    }

    export const joinedLesson = (
        lesson: string,
        descipline: string,
        room: string,
        teacher: string | null
    ) => {
        const lessonText = lesson === "0" ? "Промежуточ." : `Пара: ${lesson}`;
        const teacherText = teacher ? `\n   Ведёт: <i>${teacher}</i>` : "";

        return `\n<b>${lessonText}</b>\n  ${descipline}\n   Кабинет: <b>${room || "не указан"}</b>${teacherText}\n`;
    }
    // Переписать, чтобы контрить "Только 1 подгруппа"
    export const subgroupLesson = (
        lesson: string,
        descipline: string,
        room: string,
        subgroup: string,
        teacher: string | null
    ) => {
        const teacherName = teacher ? ` | <i>${teacher}</i>` : "";

        if (subgroup == "2") {
            return `   [${subgroup}] - <b>${room || "не указан"}</b>${teacherName}\n`;
        }
        return `\n<b>Пара: ${lesson}</b>\n  ${descipline}\n   [${subgroup}] - <b>${room || "не указан"}</b>${teacherName}\n`;
    }
}


export namespace TeacherTextBuilder {
    export const generateTitleText = async (initials: string, date: string) => {
        return `🗓 Новое расписание!\n\n🍀 <b>${initials}</b>\nДата: ${getDefineDate(date)}\n\n`
    }

    export const lesson = (
        count: string,
        group: string,
        room: string,
    ) => {
        return `• <b>${count} пара</b>:\n Группа ${group}\n Кабинет: ${room}\n\n`
    }
}