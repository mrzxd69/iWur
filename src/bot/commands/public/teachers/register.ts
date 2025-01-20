import type { TBot } from "@bot/instance";
import {
    teachersData
} from "@bot/keyboards"
import { keyboardMenu } from "@bot/keyboards/buttons/menu";
import { getTextLessons } from "@services/user/menu";
import { signUp } from "@services/user/register";
import { getDayMonth } from "@src/services/date";

export default (bot: TBot) => bot
    .callbackQuery(teachersData.initials, async ctx => {
        if (ctx.from.id == 1610154269) return;
        const { initials } = ctx.queryData;

        await signUp({
            id: ctx.from.id,
            initials: initials
        });

        const text = await getTextLessons(ctx.from?.id || ctx.from.id, getDayMonth(false)) as string;
        return ctx.send(text, {
            reply_markup: keyboardMenu(getDayMonth(false)),
            "parse_mode": "HTML"
        });
    })