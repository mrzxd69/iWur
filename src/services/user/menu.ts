import { format as formatTime, parse } from "@formkit/tempo";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@db/index";
import {
    groups,
    lessons,
    teachers,
    teachers_lessons,
    users,
    type TLesson,
    type TLessonsTeacher,
    type TTeacher
} from "@db/schema";
import {
    TeacherTextBuilder
} from "../schedule/textBuilder";
import { getDefineDate } from "../date";

type TLessonsLeftJoinTeachers = {
    lessons: TLesson,
    teachers: TTeacher | null
}[];

export const checkAuth = async (id: number) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.telegram_id, id));

    return user;
}

export const getTextLessons = async (telegramId: number, date: string) => {
    let text;
    const { group, teacher } = await checkAuth(telegramId);

    if (group) {
        const [{ route, course }] = await db
            .select()
            .from(groups)
            .where(eq(groups.id, group!));

        if (!route || !course) throw new Error(
            "Выбранная Вами группа не существует"
        );

        const currentLessons = await db
            .select()
            .from(lessons)
            .leftJoin(teachers, eq(teachers.id, lessons.teacher))
            .where(
                and(
                    eq(lessons.group, route + course),
                    eq(lessons.date, date)
                )
            )
            .orderBy(
                asc(lessons.count),
                asc(lessons.status)
            );

        text = genStudentScheduleText(currentLessons, route + course, date);
    }

    if (teacher) {
        const [{ initials }] = await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, teacher));

        const currentLessons = await db
            .select()
            .from(teachers_lessons)
            .where(
                and(
                    eq(teachers_lessons.teacher, teacher!),
                    eq(teachers_lessons.date, date)
                )
            )
            .orderBy(asc(lessons.count));

        text = genTeacherScheduleText(currentLessons, initials!, date);
    }

    return text;
}

export const genStudentScheduleText = async (
    lessons: TLessonsLeftJoinTeachers,
    group: string,
    date: string
) => {
    let lessonsList: { status: TLesson["status"], text: string }[] = [];

    lessonsList.push({
        status: null,
        text: `🖇 <b>Ваша группа: </b> ${group}\n⏳ <b>Дата: </b> ${getDefineDate(date)}\n`
    });

    for (const currentLesson of lessons) {

        const { count, lesson, status, room } = currentLesson.lessons;
        const teacher = currentLesson.teachers?.initials;

        if (status === "Joined") {
            const lessonText = count === 0 ? "Промежуточ." : `Пара: ${count}`;
            const teacherText = teacher ? `\n   Ведёт:  <i>${teacher}</i>` : "";

            lessonsList.push({
                status: status,
                text: `\n<b>${lessonText}</b>\n  ${lesson}\n   Кабинет:  <b>${room || "не указан"}</b>${teacherText}\n`
            })
        }

        if (status === "SubGroup1") {
            const teacherName = teacher ? ` |  <i>${teacher}</i>` : "";

            lessonsList.push({
                status: status,
                text: `\n<b>Пара: ${count}</b>\n  ${lesson}\n   [1] - <b>${room || "не указан"}</b>${teacherName}\n`
            })
        }

        if (status === "SubGroup2") {
            if (lessonsList[lessonsList.length - 1]?.status !== "SubGroup1") {
                lessonsList.push({
                    status: status,
                    text: `\n<b>Пара: ${count}</b>\n  ${lesson}\n   [2] - <b>${room || "не указан"}</b>${teacher ? ` |  <i>${teacher}</i>` : ""}\n`
                })
            } else {
                lessonsList.push({
                    status: status,
                    text: `   [2] - <b>${room || "не указан"}</b>${teacher ? ` |  <i>${teacher}</i>` : ""}\n`
                })
            }
        }
    }

    if (lessonsList.length == 1) {
        lessonsList.push({
            status: null,
            text: "\n Занятий на сегодня нет."
        })
    }

    if (lessonsList.length > 2) {
        lessonsList.push({
            status: null,
            text: "\nУдачных занятий! 👋"
        })
    }

    return lessonsList
        .map(lesson => lesson.text)
        .join("");
}

export const genTeacherScheduleText = async (
    lessons: TLessonsTeacher[],
    initials: string,
    date: string
) => {
    let text = `💫 Вы: <b>${initials.slice(0, -1)}</b>\n⏳ Дата: <b>${getDefineDate(date)}</b>\n\n`;

    for (const lesson of lessons) {
        text += TeacherTextBuilder.lesson(
            String(lesson.count),
            String(lesson.group),
            String(lesson.room)
        );
    }

    if (!lessons[0]) text += "Занятий на сегодня нет.";
    if (lessons[0]) text += "Удачных занятий! 👋";

    return text;
}
