import type { TBot } from "@bot/instance";
import {
    keyboardMenu,
    scheduleData
} from "@bot/keyboards";
import { getTextLessons } from "@services/user/menu";
import { getNextDay, getPrevDay } from "@src/services/date";

export default (bot: TBot) => bot
    .callbackQuery(scheduleData.nextDay, async (ctx) => {
        const { currentDate } = ctx.queryData;

        const text = await getTextLessons(ctx.from?.id || ctx.from.id, getNextDay(currentDate)) as string;

        return ctx.editText(text, {
            reply_markup: keyboardMenu(getNextDay(currentDate)),
            parse_mode: "HTML"
        });
    })
    .callbackQuery(scheduleData.previousDay, async (ctx) => {
        const { currentDate } = ctx.queryData;

        const text = await getTextLessons(ctx.from?.id || ctx.from.id, getPrevDay(currentDate)) as string;

        return ctx.editText(text, {
            reply_markup: keyboardMenu(getPrevDay(currentDate)),
            parse_mode: "HTML"
        });
    });
