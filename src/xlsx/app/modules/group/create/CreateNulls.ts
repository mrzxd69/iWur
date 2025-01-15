export default class CreateNulls {
    constructor(private data: any[]) { }

    private maxSize = 0;
    private isMaxSizeSet = false;
    private nullString = "Ничего";

    // Этот код нужен чтобы заполнить обьекты в группах где не хватает препода или еще чего то на nullString
    public create(): any {
        Object.entries(this.data).forEach(([key, value]: any) => {
            Object.entries(value).forEach(([innerKey, innerValue]: any) => {

                // Исходя из обьектов ищем максимальное число
                if (!this.isMaxSizeSet && innerValue[0].length > this.maxSize) {
                    this.maxSize = innerValue[0].length;
                    this.isMaxSizeSet = true;
                }

                // Тут мы записываем nullString в обьекты исходя из того есть ли внутри подгруппы или нет
                if (Array.isArray(innerValue)) {
                    if (innerValue.length === 1) {
                        if (innerValue[0].length < this.maxSize) {
                            innerValue[0].push(this.nullString);
                        }
                    } else if (innerValue.length >= 2) {
                        innerValue.forEach((data: any) => {
                            while (data.length < this.maxSize) {
                                data.push(this.nullString);
                            }
                        });
                    }
                }
            });
        });
        return this.data
    }

}