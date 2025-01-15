export default class CreateEmptyObjectTeacher {
    private result: any = {};

    constructor(private data: any[]) { }
    // Этот код нужен чтобы получить номера пар и их EMPTY
    public create(): object {
        for (const index in this.data) {
            const item = this.data[index];
            if (Number(item.__EMPTY_1.match(/\d+/g))) {
                this.result = item;
                break;
            }
        }

        return this.result;
    }
}