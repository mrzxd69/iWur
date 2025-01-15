export default class CreateScheduleEdit {
    private result: any = {};
    private specialSymbol: string = "_&&"

    constructor(private data: any[]) { }

    // Тут создается обьект с расписанием замен которые чем то отличаются от файла с преподами
    public create(empty: any): any {
        for (const item of this.data) {
            if (item.__EMPTY) {
                const objectName = item.__EMPTY;

                for (const key in item) {
                    if (key !== "__EMPTY" && key !== "__rowNum__") {
                        // отметаем преподов и весь мусор
                        if (item[key] !== " " && !String(objectName).toLocaleLowerCase().includes("препо")) {
                            // записываем под фамилию препода группы
                            if (!this.result[objectName]) {
                                this.result[objectName] = [];
                            }
                            // Тут чтобы не было ошибок приводим двойные пары к одному виду и убираем пробелы
                            const mergedResult = item[key]
                                .replace(/\s+/g, " ").trim() // Удаляем пробелы
                                .split(" ") // Разделяем по пробелам чтобы были массивы
                                .reduce((acc: any, curr: any) => {
                                    // Удаляем лишние символы
                                    curr = curr.replace(/[\/\?,.;:]/g, '').trim();

                                    // Соеденяем подгруппы с данными групп
                                    if (curr !== undefined && curr.includes("гр")) {
                                        acc[acc.length - 1] += `${this.specialSymbol}${curr}`.trim();
                                    } else if (curr) {
                                        acc.push(curr);
                                    }
                                    return acc;
                                }, [])
                                .join(",")
                                .trim();

                            this.result[objectName].push({ [empty[key]]: mergedResult });
                        }
                    }
                }

            }
        }

        // Обьеденение в один обьект
        for (const key in this.result) {
            this.result[key] = this.result[key].reduce((acc: any, curr: any) => {
                return { ...acc, ...curr };
            }, {});

            // удаление пустых обьектов
            if (Object.keys(this.result[key]).length === 0) {
                delete this.result[key];
            }
        }

        return this.result;
    }
}