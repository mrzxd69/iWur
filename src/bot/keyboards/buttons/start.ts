import { InlineKeyboard } from "gramio";
import { isStudentData } from "@keyboards/data/start";


export const isStudentKeyboard = () => {
    return new InlineKeyboard()
        .text("📙 Я студент", isStudentData.pack({ isStudent: true }))
        .text("📚 Я преподаватель", isStudentData.pack({ isStudent: false }));
};