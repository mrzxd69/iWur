import { InlineKeyboard } from "gramio"
import { scheduleData, settingsData } from "@keyboards/data/menu";
import { guideData } from "@keyboards/data/selecting";


export const keyboardMenu = (currentData: string) => {
    return new InlineKeyboard()
        .text("‹ Прошл. день", scheduleData.previousDay.pack({ currentDate: currentData }))
        .text("След. день ›", scheduleData.nextDay.pack({ currentDate: currentData }))
        .row()
        .text("Настройки", settingsData.pack({}))
        .row()
        .text("Зарегистрироваться заново", guideData.exit.pack({}));
}