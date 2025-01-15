import { eq, and, count } from "drizzle-orm";
import { db } from "@db/index";
import { teachers_lessons } from "@db/schema";
import { TeacherTextBuilder } from "../textBuilder";

const lessonStatus: any = {
    undefined: "Joined",
    "(1гр)": "SubGroup1",
    "(2гр)": "SubGroup2"
}

const getLessonInfo = (lesson: string) => {
    if (lesson.split("_&&").length - 1 == 2) {
        const [group, subgroup, room] = lesson.split("_&&");

        return { group, subgroup, room };
    }

    if (lesson.split("_&&").length - 1 == 1) {
        const [group, room] = lesson.split("_&&");

        return { group, room };
    }
}



export const pushTeachersLessons = async (teacherId: number, teacherData: any, date: string) => {
    let text = "";
    for (const lesson in teacherData) {
        const lessonInfo = getLessonInfo(teacherData[lesson]);
        if (!lessonInfo) continue;

        const { group, room } = lessonInfo;

        const lessonExist = await db
            .select()
            .from(teachers_lessons)
            .where(
                and(
                    eq(teachers_lessons.teacher, teacherId),
                    eq(teachers_lessons.count, Number(lesson)),
                    eq(teachers_lessons.date, date),
                    eq(teachers_lessons.room, room),
                    eq(teachers_lessons.group, group)
                )
            );

        if (!lessonExist[0]) {
            await db
                .insert(teachers_lessons)
                .values({
                    teacher: teacherId,
                    count: Number(lesson),
                    date,
                    room,
                    group
                });
            text += TeacherTextBuilder.lesson(String(lesson), group, room);
        }
    }
    return text;
}