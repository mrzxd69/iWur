import { db, lessons } from "@db/index";
import type { TLessons } from "@typescript/schedule/students";
import { and, eq, exists, or } from "drizzle-orm";

const lessonStatus: any = {
    undefined: "Joined",
    "1": "SubGroup1",
    "2": "SubGroup2"
}

export const compareLessonsStudents = async (
    group: string,
    groupData: { [key: string]: TLessons },
    date: string
) => {
    const lessonsLength = Object.values(groupData).flat().length;
    let isNeedEdit = false;

    const groupLessons = await db
        .select()
        .from(lessons)
        .where(
            and(
                and(
                    eq(lessons.group, group),
                    eq(lessons.date, date)
                ),
                or(
                    eq(lessons.status, "Joined"),
                    eq(lessons.status, "SubGroup1"),
                    eq(lessons.status, "SubGroup2"),
                )
            )
        );

    if (!groupLessons[0] || groupLessons.length != lessonsLength) isNeedEdit = true;
    for (const lesson in groupData) {
        const lessonData = groupData[lesson];
        if (Array.isArray(lessonData)) {
            if (lessonData.length === 1) {
                const existsLesson = await db
                    .select()
                    .from(lessons)
                    .where(
                        and(
                            eq(lessons.group, group),
                            eq(lessons.status, lessonStatus[lessonData[0][1]] || "Joined"),
                            eq(lessons.count, Number(lesson)),
                            eq(lessons.date, date),
                            eq(lessons.lesson, lessonData[0][0])
                        )
                    );

                if (!existsLesson[0]) isNeedEdit = true;
            }

            if (lessonData.length === 2) {
                const existsLesson1 = await db
                    .select()
                    .from(lessons)
                    .where(
                        and(
                            eq(lessons.group, group),
                            eq(lessons.status, lessonStatus[lessonData[0][1]] || "SubGroup1"),
                            eq(lessons.count, Number(lesson)),
                            eq(lessons.date, date),
                            eq(lessons.room, lessonData[0][2] || null),
                            eq(lessons.lesson, lessonData[0][0])
                        )
                    );

                const existsLesson2 = await db
                    .select()
                    .from(lessons)
                    .where(
                        and(
                            eq(lessons.group, group),
                            eq(lessons.status, lessonStatus[lessonData[1][1]] || "SubGroup2"),
                            eq(lessons.count, Number(lesson)),
                            eq(lessons.date, date),
                            eq(lessons.room, lessonData[1][2] || null),
                            eq(lessons.lesson, lessonData[1][0])
                        )
                    );

                if (!existsLesson1[0] || !existsLesson2[0]) isNeedEdit = true;
            }
        }
    }

    return isNeedEdit;
}