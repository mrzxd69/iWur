export default class RecordGroup {

    // Запись по EMPTY групп для массивов и удаление undefined  
    public record(group: any, empty: any) {
        return empty.map((keyGroup: any) => {
            return group.map((item: any) => {
                return item.map((subItem: any) => {
                    // Тут убираем пустые значения и undefined
                    return keyGroup.map((key: any) => subItem[key] !== null ? subItem[key] : "")
                        .filter((value: any) => value !== "");
                }).filter((arr: any) => arr.length > 0);
            });
        });
    }
}