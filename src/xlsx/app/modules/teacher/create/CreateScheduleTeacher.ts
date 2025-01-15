export default class CreateScheduleTeacher {
    private result: Record<string, any> = {};

    constructor(
        private data: any[]
    ) { }

    public create(empty: any) {
        for (let index in this.data) {
            const item = this.data[index];

            // Удаляем пустые значения
            for (const index in item) {
                if (item[index].trim() === "") {
                    delete item[index];
                }
            }

            for (let key in item) {
                const value = item[key];
                let name = value.split("  ")[0];

                // Отметаем лишнее чтобы не записывались в названия кабинеты и какие то рандомные числа
                if (key !== "__EMPTY" && !name.match(/\d+/g)) {

                    // Добавляем точку в конец если ее нету на всякий случай
                    if (!name.endsWith('.')) {
                        name = name + '.';
                    }

                    // Записываем названия
                    if (!this.result[name]) {
                        this.result[name] = [];
                    }

                    // Создаем вид кабинет группа
                    const roomInfo = [
                        empty[key],
                        value.split("  ")[1] === undefined ? "Пусто" : value.split("  ")[1]
                    ];

                    // Добавляем в конец кабинет
                    roomInfo.push(item.__EMPTY);

                    // Удаляем все что пусто
                    const hasEmptyValue = roomInfo.some(info => info === "Пусто");

                    if (!hasEmptyValue) {
                        this.result[name].push(roomInfo);
                    } else {
                        delete this.result[name]
                    }

                }
            }
        }

        return this.result
    }
}

