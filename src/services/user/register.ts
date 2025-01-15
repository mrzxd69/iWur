import { and, eq, is } from "drizzle-orm";
import {
    db,
    groups,
    settings,
    teachers,
    users
} from "@src/db";
import type { IServiceRegistry } from "@typescript/services";

export const signUp = async ({ id, initials, group }: IServiceRegistry) => {
    try {
        const isExistsUser = await db
            .select()
            .from(users)
            .where(eq(users.telegram_id, id));

        if (group?.course && group?.route) {
            await signUpStudent({
                id,
                group,
                isExistUser: isExistsUser.length === 1
            });
        }

        if (initials) {
            await signUpTeacher({
                id,
                initials,
                isExistUser: isExistsUser.length === 1
            })
        }
    } catch (e) {
        console.log(e);
        throw Error("Ошибка при регистрации");
    }
}

const signUpStudent = async ({ id, group, isExistUser }: Omit<IServiceRegistry, 'group'> & { group: { course: string, route: string }, isExistUser: boolean }) => {
    const isExistsGroup = await db
        .select()
        .from(groups)
        .where(and(
            eq(groups.route, group.route),
            eq(groups.course, group.course)
        ));

    if (!isExistsGroup[0]) throw new Error("Выбранная Вами группа не найдена");

    if (isExistUser) {
        return db
            .update(users)
            .set({ group: isExistsGroup[0].id, teacher: null })
            .where(eq(users.telegram_id, id));
    }

    const user = await db
        .insert(users)
        .values({
            telegram_id: id,
            group: isExistsGroup[0].id,
        })
        .returning({ id: users.id });

    await db
        .insert(settings)
        .values({
            user_id: user[0].id
        });
}

export const signUpTeacher = async ({ id, initials, isExistUser }: Omit<IServiceRegistry, 'initials'> & { initials: string, isExistUser: boolean }) => {
    const isExistsTeacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.initials, initials));

    if (!isExistsTeacher) throw new Error("Данный преподаватель не найден");

    if (isExistUser) {
        return db
            .update(users)
            .set({
                teacher: isExistsTeacher[0].id,
                group: null
            })
            .where(eq(users.telegram_id, id));
    }

    const user = await db
        .insert(users)
        .values({
            teacher: isExistsTeacher[0].id,
            telegram_id: id
        })
        .returning({ id: users.id });

    await db
        .insert(settings)
        .values({
            user_id: user[0].id
        });
}