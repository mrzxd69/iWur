import { Start } from "./Start";

export const start = async (date: string) => {
    const outputGroup: any[] = [];
    const outputEdit: any[] = [];
    const outputTeacher: any[] = [];

    console.time("Время выполнения");
    new Start(outputGroup, outputTeacher, outputEdit).start("каб", date, true);
    new Start(outputGroup, outputTeacher, outputEdit).start("уче", date, false);
    //new Start(outputGroup, outputTeacher, outputEdit).start("зам", date, false);
    // new Start(outputGroup, outputTeacher, outputEdit).start("рас");
    console.timeEnd("Время выполнения");
}