import type { TBot } from "@bot/instance";
import {
    settingsData
} from "@bot/keyboards";
import { keyboardSettings } from "@bot/keyboards/buttons/settings";
import { getSettingsParams } from "@services/user/settings";

export default (bot: TBot) => bot
    .callbackQuery(settingsData, async (ctx) => {

        const {
            notification_news,
            notification_schedule
        } = await getSettingsParams(ctx.from.id);

        await ctx.editText("Что желаете изменить?")
        return ctx.editReplyMarkup(keyboardSettings({
            notification_news,
            notification_schedule
        }));
    });