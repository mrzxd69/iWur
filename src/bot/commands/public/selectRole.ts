import { bold, format, italic } from "gramio";
import { type TBot } from "@bot/instance";
import {
    isStudentKeyboard,
    isStudentData,
    guideData,
    keyboardTeachersInitials
} from "@bot/keyboards";
import { keyboardSelectRoute } from "@keyboards/buttons/selecting/students";


export default (bot: TBot) => bot

    .callbackQuery(isStudentData, async ctx => {
        const { isStudent } = ctx.queryData;
        const isGroup = ctx.message?.chat.type === "supergroup" || ctx.message?.chat.type === "group";

        if (!isStudent) {
            if (isGroup) return ctx.answerCallbackQuery({
                text: "Преподаватели не поддерживаются в группах ❌"
            });

            const initials = await ctx.prompt(
                format`Введите ваши инициалы:\n\n(${italic("Пример:")} ${bold("Иванов И.И.")} или ${bold("Иванов")})`
            );

            if (initials) {
                // @ts-ignore
                const teachersListKeyboard = await keyboardTeachersInitials(initials.text);

                if (!teachersListKeyboard) {
                    return ctx.send("Ничего не найдено. Попробуйте еще раз.", {
                        reply_markup: isStudentKeyboard()
                    });
                }

                return ctx.send("Выберите себя из предложенного списка:", {
                    reply_markup: teachersListKeyboard
                });
            }
        }

        await ctx.editText("Отлично! Найдите свою группу в списке:");
        return ctx.editReplyMarkup(await keyboardSelectRoute());
    })

    .callbackQuery(guideData.pagination, async (ctx) => {
        const { offset } = ctx.queryData;

        return ctx.editReplyMarkup(await keyboardSelectRoute(offset));
    });
