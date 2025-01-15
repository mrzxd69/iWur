interface MissingNumbers {
    missing(array: number[]): number[][];
}

// Этот класс нужен для того чтобы получить ключи 
// По которым в дальнейшем искать пары и правильно их подставлять под группы
export default class CreateEmptyObjectGroup {
    private result: any = [];
    private temporaryResult: any = [];

    constructor(private data: any[]) { }

    public create(miss: MissingNumbers): any {
        // Отметаем лишние значения чтобы были только названия групп вида - Empty_[key]: Названия группы
        this.temporaryResult = this.data.filter(item =>
            item.__EMPTY && !Number.isFinite(Number(item.__EMPTY))
        );

        // Преобразование Empty_[key] в цифры, если нет подставляем шаблонные данные
        const keys_number = Object.keys(this.temporaryResult[0]).map((res) => Number(res.split("__EMPTY_")[1]) || 0) || [0, 3, 7, 11, 14]

        // Заполняем пустые ячейки чтобы были полные массивы для дальнейшего подставление пар
        this.temporaryResult = miss.missing(keys_number)
        this.temporaryResult[0].unshift(null) // Добавление нулл для того чтобы учитыавлся __EMPTY

        // Дозаписываем последние значения учитывая полученные данные
        const lastArray = this.temporaryResult[this.temporaryResult.length - 1];
        const startNumber = lastArray[lastArray.length - 1] + 1;
        const targetLength = this.temporaryResult[0].length - lastArray.length;

        // Дозаписываем числа в конец
        for (let i = 0; i < targetLength; i++) {
            lastArray.push(startNumber + i);
        }

        // Преобразуем это все в массивы с ключами __EMPTY_[key]
        this.result = this.temporaryResult.map((value: any) =>
            value.map((res: any) => res === null ? "__EMPTY" : "__EMPTY_" + res)
        );

        return this.result // Долно получать 4 массива по 4 значения внутри
    }
}