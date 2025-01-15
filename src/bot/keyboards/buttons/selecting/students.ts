import { InlineKeyboard } from "gramio";
import { eq } from "drizzle-orm";
import {
    db,
    groups as groupsTable
} from "@src/db";
import {
    groupsData,
    guideData,
    isStudentData,
} from "@bot/keyboards";

const OFFSET_GROUP = 8;

export const keyboardSelectRoute = async (offset: number = 0): Promise<InlineKeyboard> => {
    let buttonCountRow = 0;
    const totalGroupsCount = await db
        .selectDistinctOn([groupsTable.route])
        .from(groupsTable);

    const groups = await db
        .selectDistinctOn([groupsTable.route])
        .from(groupsTable)
        .limit(OFFSET_GROUP)
        .offset(offset);

    if (!groups[0]) return keyboardSelectRoute();

    const keyboard = new InlineKeyboard()

    for (const group of groups) {
        if (group?.route) {
            if (buttonCountRow % 2 == 0) {
                keyboard.row();
            }

            keyboard.text(group.route, groupsData.route.pack({
                route: group.route,
            }));
            buttonCountRow++;

        }
    }

    const totalPages = Math.ceil(totalGroupsCount.length / OFFSET_GROUP);
    const currentPage = Math.ceil((offset + 1) / OFFSET_GROUP);

    keyboard
        .row()
        .text("«", guideData.pagination.pack({ offset: offset >= OFFSET_GROUP ? offset - OFFSET_GROUP : offset }))
        .text(`${currentPage}/${totalPages}`, guideData.pagination.pack({ offset: 0 }))
        .text("»", guideData.pagination.pack({ offset: offset + OFFSET_GROUP }))
        .row()
        .text("‹ Назад", guideData.exit.pack({}));

    return keyboard;
}


export const keyboardSelectCourse = async (route: string) => {
    let buttonCountRow = 0;

    let courses = await db
        .selectDistinctOn([groupsTable.course])
        .from(groupsTable)
        .where(eq(groupsTable.route, route));

    if (!courses[0]) return null;

    const keyboard = new InlineKeyboard();

    for (const course of courses) {
        if (course?.course) {
            if (buttonCountRow % 2 == 0) {
                keyboard.row().text(
                    course.course,
                    groupsData.course.pack({
                        course: course.course,
                        route: route,
                    }),
                );
                buttonCountRow++;
                continue;
            }

            keyboard.text(
                course.course,
                groupsData.course.pack({
                    course: course.course,
                    route: route,
                }),
            );
            buttonCountRow++;
        }
    }

    return keyboard.row().text("‹ Назад", isStudentData.pack({ isStudent: true }));

}