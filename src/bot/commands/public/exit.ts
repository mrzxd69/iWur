import type { TBot } from "@bot/instance";
import {
    guideData,
    isStudentKeyboard
} from "@bot/keyboards";

export default (bot: TBot) => bot
    .callbackQuery(guideData.exit, (ctx) => {
        return ctx.editText("Пожалуйста, выберите кем являетесь:", {
            reply_markup: isStudentKeyboard(),
        });
    });