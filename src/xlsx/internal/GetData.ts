import { readFile, utils } from "xlsx";
import FilterData from "../app/utils/FilterData";

export default class GetData {
    private data: any;

    public get(search: string, link: string): Record<string, unknown>[] {
        try {
            const workbook = readFile(link);
            this.data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as Record<string, unknown>[];

            if (search === "уче") {
                this.data = new FilterData(this.data).group();
            }

            return this.data;

        } catch (error) {
            throw new Error("Не удалось получить данные из файла: " + link);
        }
    }
}