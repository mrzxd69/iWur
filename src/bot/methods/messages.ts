import { TelegramError } from "gramio";
import { scheduler } from "timers/promises";
import { bot } from "@bot/instance";


export const sendMessage = async (chatId: number, text: string, ms: number, retryMs: number) => {
    try {
        const result = await bot.api.sendMessage({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML"
        });

        await scheduler.wait(
            // @ts-ignore
            result instanceof TelegramError && result.params?.retry_after
                // @ts-ignore
                ? result.params.retry_after * retryMs
                : ms
        );

    } catch (e) {
        console.log("[SendMessage]: Ошибка при отправке сообщения: ", e);
    }
}