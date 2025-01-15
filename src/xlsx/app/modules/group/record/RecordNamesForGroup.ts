export default class RecordNamesForGroup {

    public record(result: any) {
        // Вытаскивание названий групп и запись под них значений
        return result.map((sectionArray: any) => {
            // Временный обьект
            const dataObject: { [key: string]: any[][] } = {};

            sectionArray.forEach((section: any) => {
                // Получаем название группы и его значения
                const groupName = section[0]?.[0];
                const values = section.slice(1);

                // Небольшие проверки на пустоту и undefined
                if (groupName !== undefined) {
                    if (!dataObject[groupName]) {
                        dataObject[groupName] = [];
                    }

                    dataObject[groupName].push(values);
                }
            });

            return dataObject
        });
    }
}