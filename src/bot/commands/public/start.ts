import { type TBot } from "@bot/instance";
import {
    isStudentKeyboard,
} from "@bot/keyboards";
import { keyboardMenu } from "@bot/keyboards/buttons/menu";
import { checkAuth, getTextLessons } from "@services/user/menu";
import { getDate, getDayMonth } from "@src/services/date";


export default (bot: TBot) => bot

    .command("start", async (ctx) => {
        if (await checkAuth(ctx.from?.id || ctx.chat.id)) {

            const text = await getTextLessons(ctx.from?.id || ctx.chat.id, getDayMonth(false)) as string;

            return ctx.send(text, {
                reply_markup: await keyboardMenu(getDayMonth(false)),
                "parse_mode": "HTML"
            });
        }

        await ctx.send(
            `<b>Добро пожаловать!</b>\n\nДанный сервис облегчает работу с расписанием 📚\n\n<i>🔹 Полный функционал описан в:\n</i>${process.env.ARTICLE}`, {
            parse_mode: "HTML"
        });

        return ctx.send("Пожалуйста, выберите кем Вы являетесь:", {
            reply_markup: isStudentKeyboard()
        })
    });
