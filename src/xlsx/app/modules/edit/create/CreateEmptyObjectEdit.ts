export default class CreateEmptyObjectEdit {
    private result: any = [];

    constructor(private data: any[]) { }

    // Этот код нужен чтобы получить номера пар и их EMPTY
    public create(): any {
        for (const index in this.data) {
            const item = this.data[index];

            // Ищем номера пар
            if (String(item.__EMPTY).toLowerCase().includes("препо")) {
                Object.entries(item).forEach(([res, val]) => {
                    if (res !== "__EMPTY") {
                        this.result.push({ [res]: String(val).split(" ")[0] });
                    }
                });
            }
        }

        // Приводим все обьекты в один вид
        return this.result.reduce((acc: any, curr: any) => {
            return { ...acc, ...curr };
        }, {});
    }
}

