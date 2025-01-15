import type { TBot } from "@bot/instance";
import {
    groupsData,
    keyboardSelectCourse,
    keyboardSelectRoute
} from "@bot/keyboards"
import { keyboardMenu } from "@bot/keyboards/buttons/menu";
import { getTextLessons } from "@services/user/menu";
import { signUp } from "@services/user/register";
import { getDayMonth } from "@src/services/date";


export default (bot: TBot) => bot

    .callbackQuery(groupsData.route, async (ctx) => {
        const { route } = ctx.queryData;

        const keyboard = await keyboardSelectCourse(route);

        if (!keyboard) {
            return ctx.editText("Похоже в Вашей группе нет курсов", {
                reply_markup: await keyboardSelectRoute()
            });
        }

        await ctx.editText(`Теперь стоит выбрать <b>курс</b> Вашей группы:`, {
            parse_mode: "HTML"
        });
        return ctx.editReplyMarkup(keyboard);
    })


    .callbackQuery(groupsData.course, async (ctx) => {
        const { route, course } = ctx.queryData;

        const registrantId = ctx.message?.chat.id && ctx.message?.chat.id < 1
            ? ctx.message?.chat.id
            : ctx.from.id;

        await signUp({
            id: registrantId,
            group: {
                route,
                course
            }
        });

        const text = await getTextLessons(ctx.from?.id || ctx.from.id, getDayMonth(false)) as string;

        return ctx.send(text, {
            reply_markup: await keyboardMenu(getDayMonth(false)),
            "parse_mode": "HTML"
        });
    })