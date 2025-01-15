import GetLinks from "./internal/GetLinks";
import GetData from "./internal/GetData";

import SaveManager from "./app/main/SaveManager";

export class Start {
    constructor(private outputGroup: any[], private outputTeacher: any[], private outputEdit: any[]) { }

    // Тут происходит вся работа
    public async start(search: string, date: string, isSavingTeacher: boolean) {
        const link = new GetLinks().get(search);
        const maxLength = link.length
        for (let num = 0; num < maxLength; num++) {
            const data = new GetData().get(search, link[num]);

            if (search === "каб") {
                const isMaxNum = num === maxLength - 1;
                await new SaveManager(this.outputGroup, this.outputTeacher, this.outputEdit, isMaxNum).saveTeacher(data, date, isSavingTeacher);
            }
            if (search === "рас") {
                const isMaxNum = num === maxLength - 1;
                await new SaveManager(this.outputGroup, this.outputTeacher, this.outputEdit, isMaxNum).saveWeek(data);
            }
            if (search === "уче") {
                const isMaxNum = num === maxLength - 1;

                // Нужно для получения полных данных кабинетов и замен
                new Start(this.outputGroup, this.outputTeacher, this.outputEdit).start("каб", date, isSavingTeacher);
                new Start(this.outputGroup, this.outputTeacher, this.outputEdit).start("зам", date, isSavingTeacher);

                await new SaveManager(this.outputGroup, this.outputTeacher, this.outputEdit, isMaxNum).saveGroup(data, this.outputTeacher, this.outputEdit, date);
            }
            if (search === "зам") {
                const isMaxNum = num === maxLength - 1;
                // Нужно для получения полных данных кабинетов
                new Start(this.outputGroup, this.outputTeacher, this.outputEdit).start("каб", date, isSavingTeacher);

                await new SaveManager(this.outputGroup, this.outputTeacher, this.outputEdit, isMaxNum).saveEdit(data, this.outputTeacher);
            }

        }
    }
}