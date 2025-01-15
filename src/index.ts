import { bot } from "@bot/instance";
import { webserver } from "@src/webserver";

webserver.listen(5555);
bot.start();
