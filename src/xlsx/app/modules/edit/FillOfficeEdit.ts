export default class FillOfficeEdit {
    private specialSymbol: string = "_&&"

    // Этот код добавляет недостающие кабинеты группам учитывая уже имеющиеся, это не точные кабинеты чисто чтобы ошибок не было
    public fill(data: any) {
        for (const key in data) {
            const entries = Object.entries(data[key]);

            entries.forEach(([innerKey, value]: any, index) => {
                const valueNoSubgroup = value.split(this.specialSymbol).filter((item: any) => !/\(\d+гр\)/.test(item))

                if (valueNoSubgroup.length < 2) {
                    const zeroValue: any = entries[0][1];
                    const middleValue: any = entries[Math.round(entries.length / 2)][1];

                    let targetValue: any;

                    if (index - 1 <= 0 && entries.length > index) {
                        targetValue = entries[index + 1][1];
                    } else if (index < entries.length) {
                        targetValue = entries[index - 1][1];
                    }

                    // Убираем из строки подгруппы чтобы код работал нормально и без ошибок 
                    const filterValue = (value: any) => value.split(this.specialSymbol).filter((item: any) => !/\(\d+гр\)/.test(item)).join(this.specialSymbol);
                    // Так же убираем подгруппы но для того чтобы в массиве всегда было два элемента группа и кабинет
                    const setData = (value: any) => this.specialSymbol + String(value).split(this.specialSymbol).filter((item: any) => !/\(\d+гр\)/.test(item))[1];

                    // Записываем данные
                    if (filterValue(targetValue).includes(this.specialSymbol)) {
                        data[key][innerKey] += setData(targetValue);
                    } else if (filterValue(zeroValue).includes(this.specialSymbol)) {
                        data[key][innerKey] += setData(zeroValue);
                    } else if (filterValue(middleValue).includes(this.specialSymbol)) {
                        data[key][innerKey] += setData(middleValue);
                    }

                }
            });
        }
        return data
    }
}