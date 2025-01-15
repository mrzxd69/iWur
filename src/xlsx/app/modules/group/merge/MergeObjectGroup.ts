export default class MergeObjectGroup {
    constructor(private resultTeacher: any, private resultGroup: any) { }
    private specialSymbol: string = "_&&"

    // Этот код записывает преподов в группы
    public merge(isMaxNum: boolean): any {
        let maxSize = 0;
        let isMaxSizeSet = false;

        for (const obj in this.resultGroup) {
            for (const key in this.resultTeacher) {
                // сверяем по началу строки есть ли такой ключ
                if (key.startsWith(obj)) {
                    Object.entries(this.resultGroup[obj]).forEach(([inKey, inValue]: any) => {
                        Object.entries(this.resultTeacher[key]).forEach(([innerKey, innerValue]: any) => {
                            // тут находится название группы и через specialSymbol находим потом кабинет
                            const office = key.split(this.specialSymbol);
                            // Тут мы проверяем совпадает ли кабинет с уже имеющимся
                            const isContinue = inValue.some((el: any) => office.some((item: any) => el.includes(item)));

                            // Проверяем по кабинетам и подгруппам 
                            if (isContinue && inKey === innerKey) {
                                // Записываем если совпадает кабинет и если там нет такого препода
                                inValue.forEach((el: any) => {
                                    office.forEach((item: any) => {
                                        if (el.includes(item) && !el.includes(innerValue)) {
                                            el.push(innerValue);
                                        }
                                    });
                                });

                                // Ищем первое максимальное число для стабильной работы дальше
                                if (!isMaxSizeSet && inValue[0].length > maxSize) {
                                    maxSize = inValue[0].length;
                                    isMaxSizeSet = true;
                                }

                                // Записываем остатки если такие имеются из замен или основного файла но уже по соответствию номера пары
                            } else if (inKey === innerKey && isMaxNum && Array.isArray(inValue) && (inValue[0].length < maxSize || inValue[0].length < 4)) {
                                inValue.forEach((el: any) => {
                                    if (!el.includes(innerValue)) {
                                        el.push(innerValue);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        }
        return this.resultGroup;
    }
}