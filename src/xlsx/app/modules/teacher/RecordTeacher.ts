export default class RecordTeacher {
    private specialSymbol: string = "_&&"

    public record(teacher: any) {
        // Запись пар для групп и добавление набинетов через знак specialSymbol
        return Object.entries(teacher)
            .reduce((acc: any, [surname, entries]: any) => {
                acc[surname] = entries.reduce((obj: any, [couple, name, office]: any) => {
                    const key_number = Number(String(couple).split(" ")[0]) // Вытаскиваем номер пары
                    const data = name.replace(/\s+/g, this.specialSymbol).trim() + this.specialSymbol + office // Разделяем группу и кабинет
                    obj[key_number] = data;  // Записываем в обьект

                    return obj;
                }, {});
                return acc;
            }, {});
    }
}