import { sendMessage } from "@bot/methods/messages";
import { db, groups, settings, teachers, users } from "@db/index"
import { and, eq } from "drizzle-orm"


export const startStudentSchedule = async (
    text: string,
    group: string,
    ms: number,
    retryMs: number
) => {
    const match = group.match(/^([А-Яа-яA-Za-z]+)(\d+.*)$/)!; // cringe

    const [groupId] = await db
        .select()
        .from(groups)
        .where(and(
            eq(groups.route, match[1]),
            eq(groups.course, match[2])
        ));

    if (groupId) {
        const receivers = await db
            .select()
            .from(users)
            .leftJoin(settings, eq(settings.user_id, users.id))
            .where(
                and(
                    eq(users.group, groupId.id),
                    eq(settings.notification_schedule, true)
                )
            );


        for (const receiver of receivers) {
            await sendMessage(receiver.users.telegram_id, text, ms, retryMs);
        }
    }
}

export const startTeacherSchedule = async (
    text: string,
    teacherId: number,
    ms: number,
    retryMs: number
) => {
    const receivers = await db
        .select()
        .from(users)
        .leftJoin(settings, eq(settings.user_id, users.id))
        .where(
            and(
                eq(users.teacher, teacherId),
                eq(settings.notification_schedule, true)
            )
        );

    for (const receiver of receivers) {
        await sendMessage(receiver.users.telegram_id, text, ms, retryMs);
    }
}