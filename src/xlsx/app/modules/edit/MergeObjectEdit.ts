export default class MergeObjectEdit {
    private transformedData: { [key: string]: any } = {};
    private specialSymbol: string = "_&&"

    constructor(private resultTeacher: any, private resultEdit: any) { }

    // Тут происходит удаление обьектов которые не отличаются от замен 
    public merge(): object {
        for (const key in this.resultTeacher) {
            for (const obj in this.resultEdit) {
                if (key === obj) {
                    Object.entries(this.resultEdit[obj]).forEach(([innerKey, value]: any) => {
                        const editsValue = this.resultTeacher[key][innerKey];

                        const regexPattern = editsValue?.split(this.specialSymbol)[0].replace(/\s+/g, '').trim(); // Убираем лишние пробелы
                        const regex = new RegExp(regexPattern, 'g'); // Создаем регулярное выражение

                        // Ищем совпадения в строке value
                        const matches = value.match(regex);

                        // Записываем значение в resultEdit со знаком this.specialSymbol
                        if (editsValue !== undefined && (matches || value.includes(regexPattern))) {
                            const office = editsValue.split(this.specialSymbol).filter((item: any) => !/\(\d+гр\)/.test(item));
                            this.resultEdit[obj][innerKey] = value + this.specialSymbol + office[1];
                        }

                        if (value.includes(",") || editsValue === undefined) {
                            this.transformedData[key] = this.resultEdit[obj];
                        }
                    })
                }
            }
        }
        return this.transformedData;
    }
}
