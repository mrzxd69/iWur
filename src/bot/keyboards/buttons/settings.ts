import { InlineKeyboard } from "gramio"
import type { IUserSettings } from "@typescript/telegram/settings";
import { notifications } from "@keyboards/data/settings";


export const keyboardSettings = (settings: IUserSettings) => {



    return new InlineKeyboard()
        .text(
            `${settings.notification_news ? `🔕 Выключить` : `🔔 Включить`} уведомления о новостях`,
            notifications.news.pack({}),
        )
        .row()
        .text(
            `${settings.notification_schedule ? `🔕 Выключить` : `🔔 Включить`} уведомления о расписании`,
            notifications.schedule.pack({}),
        );
}