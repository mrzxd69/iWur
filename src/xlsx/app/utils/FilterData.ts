export default class FilterData {

    constructor(private data: any[]) { }

    // В этом коде я убираю библиотечный день и лишние строки которые идут после ячеек с парами
    public group() {
        const regex = /^(?!.*библио)(?=.*\d)(?=.*\s)(?=.*-).+$/;

        for (const index in this.data) {
            const keysToDelete: string[] = []; // Массив для хранения ключей которые нужно удалить

            Object.entries(this.data[index]).forEach(([key, value]) => {
                // Проверяем, содержит ли ключ "EMPTY"
                if (!String(key).includes("EMPTY")) {
                    // Удаляем старый ключ и записываем новый с его значением и нужным ключом 
                    const newKey = "__EMPTY_0";
                    this.data[index][newKey] = value;
                    keysToDelete.push(key);
                }
                // Убираю лишние пробелы в названиях
                const nameGroup = String(value).replace(/\s+/g, ' ').trim();
                this.data[index][key] = nameGroup; // Обновляем значение
            });

            Object.entries(this.data[index]).forEach(([key, value]) => {
                if (regex.test(String(value))) {
                    keysToDelete.push(key); // Добавляем ключ в массив, если значение соответствует регулярному выражению
                }
            });

            // Удаляем ключи после завершения итерации
            keysToDelete.forEach(key => {
                delete this.data[index][key];
            });

        }

        return this.data;
    }
}