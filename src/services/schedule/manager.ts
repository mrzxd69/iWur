import { ilike } from "drizzle-orm";
import type { TGroupsSchedule } from "@typescript/services"
import { pushStudentsLessons } from "@services/schedule/database/students";
import { pushTeachersLessons } from "@services/schedule/database/teachers";
import { db, teachers } from "@db/index";
import { compareLessonsStudents } from "./database/compare";
import { startTeacherSchedule } from "./telegram";
import { TeacherTextBuilder } from "./textBuilder";

export const manageScheduleStudents = async (groupsData: TGroupsSchedule, date: string) => {
    for (const group in groupsData) {
        const isNeedEdit = await compareLessonsStudents(group, groupsData[group] as any, date);

        if (isNeedEdit) {
            await pushStudentsLessons(group, groupsData[group], date);
        }
    }
}

export const manageScheduleTeachers = async (lessons: { [key: string]: { [key: string]: string } }, date: string) => {
    for (const teacher in lessons) {
        if (teacher.includes("Зенченко")) console.log(lessons[teacher]);
        let text = await TeacherTextBuilder.generateTitleText(teacher, date)
        if (teacher) {
            const [teacherId] = await db
                .select()
                .from(teachers)
                .where(ilike(teachers.initials, `%${teacher}%`));

            text += await pushTeachersLessons(teacherId.id, lessons[teacher], date);

            await startTeacherSchedule(text, teacherId.id, 80, 500);
        }
    }
}
