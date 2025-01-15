import type { TBot } from "@bot/instance";
import { notifications } from "@bot/keyboards";
import { keyboardSettings } from "@bot/keyboards/buttons/settings";
import {
    editNotice
} from "@services/user/settings";

export default (bot: TBot) => bot
    .callbackQuery(notifications.news, async (ctx) => {
        const notice = await editNotice("news", ctx.from.id);

        if (notice[0]) {
            const noticeState = notice[0].notification_news;
            const text = `${noticeState ? "Теперь" : "Больше"} Вы ${noticeState ? "не" : ""} получаете уведомления о новостях`;

            await ctx.editText(text)

            return ctx.editReplyMarkup(keyboardSettings({
                notification_news: notice[0].notification_news,
                notification_schedule: notice[0].notification_schedule
            }));
        }
    })
    .callbackQuery(notifications.schedule, async (ctx) => {
        const notice = await editNotice("schedule", ctx.from.id);

        if (notice[0]) {
            const noticeState = notice[0].notification_schedule;
            const text = `${noticeState ? "Теперь" : "Больше"} Вы ${noticeState ? "не" : ""} получаете уведомления о расписании`;

            await ctx.editText(text)

            return ctx.editReplyMarkup(keyboardSettings({
                notification_news: notice[0].notification_news,
                notification_schedule: notice[0].notification_schedule
            }));
        }
    });