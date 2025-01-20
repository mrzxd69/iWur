import { Bot } from "gramio";
import { prompt } from "@gramio/prompt";
import { autoRetry } from "@gramio/auto-retry";
import { shareSchedule } from "@bot/inline/index";

const { default: commands } = await import("./commands/**/*.ts");

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)
    .extend(autoRetry())
    .onError("message", async ({ context, error }) => {
        context.send(error.message, {
            chat_id: 1595889574
        });
        return context.send("Произошла неизвестная ошибка");
    })
    .extend(prompt())


for (const { default: command } of commands) {
    if (!(command instanceof Function)) continue;
    bot.group(shareSchedule)
    bot.group(command as (bot: Bot) => Bot);
}

export type TBot = typeof bot;