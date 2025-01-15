import { readdirSync } from "fs";
import path from "path";

export default class GetLinks {
    constructor(private pathData?: string) { }

    // Тут мы получаем все файлы по заданому пути
    public get(search: string): string[] {
        const globalData = path.join(path.resolve(), "/data");
        try {
            const filesPath = readdirSync(this.pathData || globalData)
                .filter(fileName => fileName.toLowerCase().includes(search))
                .map(fileName => path.join(this.pathData || globalData, fileName));

            return filesPath;
        } catch (error) {
            throw new Error("Не удалось получить данные по пути: " + this.pathData || globalData);
        }
    }
}