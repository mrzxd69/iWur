interface MissingNumbers {
    missing(array: number[]): number[][];
}

export default class CreateGroupData {
    private result: any[] = [];
    private temporaryResult: number[] = [];

    constructor(private data: any[]) { }

    // Этот метод нужен для создания границ обьекта при записи пар
    public create(miss: MissingNumbers) {
        // Ищем максимальное число в массивах
        const maxRowNum = this.data.reduce((max, current) => {
            return Math.max(0, current.__rowNum__);
        }, -Infinity);

        // Фильтруем данные для поиска строк, где __EMPTY не является конечным числом
        this.temporaryResult = this.data
            .filter(item => item.__EMPTY && !Number.isFinite(Number(item.__EMPTY)))
            .map(item => item.__rowNum__); // Store only row numbers in a temporary array

        // Запись в конец максимального числа
        this.temporaryResult.push(maxRowNum)

        // Используем метод missingNumbers для заполнения пустот
        this.result = miss.missing(this.temporaryResult).map(res =>
            // Для каждого номера в результате ищем соответствующий объект в this.data
            res.map(num => this.data.find(item => item.__rowNum__ === num) || num) // Заменяем на найденный объект или оставляем число
        );

        return this.result // Отправляем массим только из чисел
    }
}