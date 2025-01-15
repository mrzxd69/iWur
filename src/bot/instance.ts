import { Bot } from "gramio";
import { prompt } from "@gramio/prompt";
import { autoRetry } from "@gramio/auto-retry";
import { db, users } from "@db/index.ts";
import { eq } from "drizzle-orm";

const { default: commands } = await import("./commands/**/*.ts");

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)
    .extend(autoRetry())
    .onError("message", async ({ context, error }) => {
        if (error instanceof Error) {
            return context.send(error.message);
        }
        console.log(error);
        return context.send("Произошла неизвестная ошибка");
    })
    .extend(prompt())


for (const { default: command } of commands) {
    if (!(command instanceof Function)) continue;
    bot.group(command as (bot: Bot) => Bot);
}

export type TBot = typeof bot;