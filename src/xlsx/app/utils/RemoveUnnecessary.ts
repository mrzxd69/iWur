export default class RemoveUnnecessary {
    private exceptions: string = "библио"
    // Поиск по всем местам библиотечного + undefined дня и удаление
    public remove(obj: any) {
        Object.keys(obj).forEach(key => {
            if (key.includes(this.exceptions) || key.includes("undefined")) {
                delete obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.remove(obj[key]);
            }
        });

        if (Array.isArray(obj)) {
            for (let i = obj.length - 1; i >= 0; i--) {
                if (typeof obj[i] === 'string' && obj[i].includes(this.exceptions)) {
                    obj.splice(i, 1);
                } else if (typeof obj[i] === 'object' && obj[i] !== null) {
                    this.remove(obj[i]);
                }
            }
        }
    }
}