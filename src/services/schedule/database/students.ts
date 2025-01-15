import { eq, and } from "drizzle-orm";
import { db, lessons, teachers } from "@db/index";
import { StudentTextBuilder } from "@services/schedule/textBuilder";
import { startStudentSchedule } from "../telegram";
import { lessonStatus } from "@src/constants";

export const pushStudentsLessons = async (group: string, groupData: any, date: string) => {
    let text = await StudentTextBuilder.generateTitleText(group, date);

    await db
        .delete(lessons)
        .where(
            and(
                eq(lessons.group, group),
                eq(lessons.date, date)
            )
        );

    for (const lesson in groupData) {
        if (groupData[lesson].length === 1) {
            try {
                text += await proccessJoinedLessons(
                    lesson,
                    groupData[lesson],
                    group,
                    date
                );
            } catch (e) {
                console.log(`[${group}] Ошибка при записи совмещенной пары: `, e);
            }
        }

        if (groupData[lesson].length === 2) {
            try {
                text += await proccessSubGroupsLessons(
                    lesson,
                    groupData[lesson],
                    group,
                    date
                );
            } catch (e) {
                console.log(`[${group}] Ошибка при записи разделенной пары: `, e);
            }
        }
    }
    await startStudentSchedule(text, group, 80, 500);
}

export const proccessSubGroupsLessons = async (
    count: string,
    lessonData: any,
    group: string,
    date: string,
) => {
    let result = "";

    for (let [lesson, subgroup, room, maybeTeacher] of lessonData) {
        let teacherId;

        if (maybeTeacher == "Ничего") maybeTeacher = null;

        if (maybeTeacher) {
            const teacher = await db
                .select()
                .from(teachers)
                .where(eq(teachers.initials, maybeTeacher || null));

            teacherId = teacher.length ? teacher[0].id : null;
        }

        const existLessons = await db
            .select()
            .from(lessons)
            .where(
                and(
                    eq(lessons.count, Number(count)),
                    eq(lessons.group, group),
                    eq(lessons.date, date),
                    eq(lessons.status, lessonStatus[subgroup] || "Joined"),
                    eq(lessons.room, room || null)
                )
            );

        if (existLessons[0]) {
            await db
                .update(lessons)
                .set({
                    count: Number(count),
                    date,
                    group,
                    lesson,
                    room: room || null,
                    teacher: teacherId || null,
                    status: lessonStatus[subgroup] || "Joined"
                })
                .where(eq(lessons.id, existLessons[0].id));
        } else {
            db
                .insert(lessons)
                .values({
                    count: Number(count),
                    date,
                    group,
                    lesson,
                    room: room || null,
                    teacher: teacherId || null,
                    status: lessonStatus[subgroup] || "Joined"
                })
                .catch(e => console.log(e));
        }
        result += StudentTextBuilder.subgroupLesson(count, lesson, room, subgroup, maybeTeacher || null);
    };

    return result;
}


export const proccessJoinedLessons = async (
    count: string,
    lessonData: any,
    group: string,
    date: string,
) => {
    let teacherId;

    if (!lessonData || lessonData.length === 0) return;

    let [lesson, subgroup, room, maybeTeacher] = lessonData[0];

    if (maybeTeacher == "Ничего") maybeTeacher = null;

    if (maybeTeacher) {
        const teacher = await db
            .select()
            .from(teachers)
            .where(eq(teachers.initials, maybeTeacher));

        teacherId = teacher.length ? teacher[0].id : null;
    }


    const existLessons = await db
        .select()
        .from(lessons)
        .where(
            and(
                eq(lessons.count, Number(count)),
                eq(lessons.group, group),
                eq(lessons.date, date),
                eq(lessons.lesson, lesson || null),
                eq(lessons.status, lessonStatus[subgroup] || "Joined"),
                eq(lessons.room, room || null)
            )
        );

    if (existLessons[0]) {
        await db
            .update(lessons)
            .set({
                count: Number(count),
                date,
                group,
                lesson,
                room: room || null,
                teacher: teacherId || null,
                status: lessonStatus[subgroup] || "Joined"
            })
            .where(eq(lessons.id, existLessons[0].id));
    } else {
        await db
            .insert(lessons)
            .values({
                count: Number(count),
                date,
                group,
                lesson,
                room: room || null,
                teacher: teacherId || null,
                status: lessonStatus[subgroup] || "Joined"
            })
            .catch(e => console.log(e));;
    }

    return StudentTextBuilder.joinedLesson(count, lesson, room, maybeTeacher || null)
}
