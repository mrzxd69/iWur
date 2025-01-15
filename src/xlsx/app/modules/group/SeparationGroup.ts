export default class SeparationGroup {
    private nullNames: string = "Библиотечный день"

    public separation(result: any) {
        // До этого кода было все в виде [1 - номер пары, остальные значения]
        // Тут происходит разделение на пары и выделение библиотечного дня на nullNames
        let exceptionFind: string = "";

        return result.reduce((acc: any, curr: any) => {
            // Поиск библиотечного дня
            const foundStrings: any[] = [
                ...Object.keys(curr).filter(key => key.includes("библио")),

                ...Object.values(curr).flat().flat().filter((item: any) =>
                    Array.isArray(item) && item.some((subItem: any) => String(subItem).includes("библио"))
                )
            ];

            // Преобразование в строку библиотечного дня
            if (exceptionFind === "" && Array.isArray(foundStrings) && foundStrings.length > 0) {
                exceptionFind = foundStrings.flat(Infinity).filter(item => typeof item === 'string')[0];
            }

            Object.entries(curr).forEach(([groupName, lessons]: any) => {
                const wordsArray = exceptionFind.split(/[\s,]+/).map(word => word.trim()).filter(word => word.length > 0);

                // Делаем массив и находим группы у которых библиотечный день
                const exception = wordsArray.some((names: any) => {
                    if (/\d/.test(names)) {
                        if (String(groupName).toLowerCase().includes(names.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                });

                if (!acc[groupName] && !Number(groupName)) {
                    acc[groupName] = {};
                }

                let hasLessons = false;

                // Не пропускаем группы у которых есть библиотечный день
                if (!exception && !Number(groupName)) {
                    lessons.forEach((lesson: any) => {
                        Object.entries(lesson).forEach(([, lessonDetails]: any) => {
                            const lessonKey = lessonDetails[0];

                            // Считаем сколько undefined внутри чтобы отметать там где их слишком много
                            const undefinedCount = lessonDetails.slice(1).filter((item: any) => item === undefined).length;

                            if (undefinedCount < 2) {
                                if (!acc[groupName][lessonKey]) {
                                    acc[groupName][lessonKey] = [];
                                }
                                // Разделяем на пары
                                acc[groupName][lessonKey].push(lessonDetails.slice(1));
                                hasLessons = true;
                            }
                        });
                    });
                }

                // Записываем что nullNames
                if (!hasLessons && !Number(groupName) || exception) {
                    acc[groupName] = this.nullNames;
                }
            });

            return acc;
        }, {});
    }
}