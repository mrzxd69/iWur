import Elysia, { t } from "elysia"
import fs from "fs";
import { start } from "@src/xlsx";

export const webserver = new Elysia()
    .post("/upload", async ({ body: { files } }) => {
        deleteFolder();

        files.forEach(file => {
            Bun.write(process.cwd() + "/data/" + file.name, file);
        });

        const date = files[0].name.match(/\d{2}\.\d{2}/)!;

        await start(String(date));
    }, {
        body: t.Object({
            files: t.Files()
        })
    });

export const deleteFolder = () => {
    const folderPath = process.cwd() + "/data";

    if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, {
            recursive: true
        });
    }
    fs.mkdirSync(folderPath);
}