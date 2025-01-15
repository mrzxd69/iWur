import { isStudentData, teachersData } from "@bot/keyboards";
import { db, teachers } from "@db/index"
import { ilike } from "drizzle-orm"
import { InlineKeyboard } from "gramio";


export const keyboardTeachersInitials = async (initials: string) => {
    const maybeTeachersList = await db
        .select()
        .from(teachers)
        .where(ilike(teachers.initials, `%${initials}%`));

    if (!maybeTeachersList[0]) return null;

    const keyboard = new InlineKeyboard();

    for (const teacher of maybeTeachersList) {
        if (teacher.initials) {
            keyboard.row().text(
                teacher.initials,
                teachersData.initials.pack({
                    initials: teacher.initials
                })
            );
        }
    }

    return keyboard
        .row()
        .text("‹ Назад", isStudentData.pack({ isStudent: false }));
}