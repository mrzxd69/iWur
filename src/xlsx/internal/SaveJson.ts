import path from "path";
import { writeFile } from "fs/promises";

export default class SaveJson {
    constructor(
        private result: object,
    ) { }

    // Сохранение файлов в жсон
    public async save(name: string): Promise<void> {
        const fileName = name + ".json";
        const filePath = path.join(path.resolve(), "/output", fileName);

        try {
            await writeFile(filePath, JSON.stringify(this.result, null, 2));
        } catch (error) {
            throw new Error("Не удалось сохранить файл: " + filePath);
        }
    }
}