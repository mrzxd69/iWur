import MissingNumbers from "../utils/MissingNumbers";
import CreateEmptyObjectGroup from "../modules/group/create/CreateEmptyObjectGroup";
import CreateGroupData from "../modules/group/create/CreateGroupData";
import SaveJson from "../../internal/SaveJson";
import RemoveUnnecessary from "../utils/RemoveUnnecessary";
import RecordGroup from "../modules/group/record/RecordGroup";
import RecordNamesForGroup from "../modules/group/record/RecordNamesForGroup";
import SeparationGroup from "../modules/group/SeparationGroup";
import CreateEmptyObjectTeacher from "../modules/teacher/create/CreateEmptyObjectTeacher";
import CreateScheduleTeacher from "../modules/teacher/create/CreateScheduleTeacher";
import RecordTeacher from "../modules/teacher/RecordTeacher";
import CreateScheduleEdit from "../modules/edit/create/CreateScheduleEdit";
import CreateEmptyObjectEdit from "../modules/edit/create/CreateEmptyObjectEdit";
import MergeObjectEdit from "../modules/edit/MergeObjectEdit";
import FillOfficeEdit from "../modules/edit/FillOfficeEdit";
import ConvertTeacherInGroup from "../modules/group/ConvertTeacherInGroup";
import MergeObjectGroup from "../modules/group/merge/MergeObjectGroup";
import CreateNulls from "../modules/group/create/CreateNulls";
import { pushStudentsLessons } from "@src/services/schedule/database/students";
import { convertTypeAcquisitionFromJson } from "typescript";
import { pushGroups, pushTeachers } from "@src/services/collegeData/pushDatabase";
import { manageScheduleStudents, manageScheduleTeachers } from "@src/services/schedule/manager";

export default class SaveManager {

    constructor(
        private outputGroup: any,
        private outputTeacher: any,
        private outputEdit: any,
        private isMaxNum: boolean,
    ) {
    }

    private resultGroup: any = {};
    private resultTeacher: any = {};
    private resultEdit: any = {}
    // Это короче меняй но не удаляй жсончик удобно смотреть и комент убери этот
    private isTestJson: boolean = true

    public async saveTeacher(data: any, date: string, isSavingTeacher: boolean) {
        const empty = new CreateEmptyObjectTeacher(data).create()
        const teacher = new CreateScheduleTeacher(data).create(empty);

        this.resultTeacher = new RecordTeacher().record(teacher);

        this.outputTeacher.push(this.resultTeacher);

        this.outputTeacher = this.outputTeacher.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

        if (this.isMaxNum && isSavingTeacher) {
            if (this.isTestJson) {
                new SaveJson(this.outputTeacher).save("Преподы");
            }

            const teachers = [];
            for (const teacher in this.outputTeacher) {
                teachers.push({
                    initials: teacher
                });
            }
            // Твой код
            await pushTeachers(teachers);
            await manageScheduleTeachers(this.outputTeacher, date);
        }
    }

    public async saveWeek(data: any) {
        // for (const key in data) {
        //     console.log(data[key].__EMPTY);
        //     console.log(data[key].__rowNum__);
        //     console.log("_----");

        // }
    }

    public async saveEdit(data: any, outputTeacher: any) {
        const empty = new CreateEmptyObjectEdit(data).create()

        this.resultEdit = new CreateScheduleEdit(data).create(empty);

        if (outputTeacher.length > 1) {
            outputTeacher = outputTeacher.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

            this.resultEdit = new MergeObjectEdit(outputTeacher, this.resultEdit).merge();
            this.resultEdit = new FillOfficeEdit().fill(this.resultEdit);
        }

        this.outputEdit.push(this.resultEdit);

        if (this.isMaxNum) {
            if (this.isTestJson) {
                new SaveJson(this.resultEdit).save("Замены");
            }
            // Твой код
        }
    }

    public async saveGroup(data: any, outputTeacher: any, outputEdit: any, date: string) {
        const empty = new CreateEmptyObjectGroup(data).create(new MissingNumbers);
        const group = new CreateGroupData(data).create(new MissingNumbers);

        this.resultGroup = new RecordGroup().record(group, empty);
        this.resultGroup = new RecordNamesForGroup().record(this.resultGroup);
        this.resultGroup = new SeparationGroup().separation(this.resultGroup);

        new RemoveUnnecessary().remove(this.resultGroup);

        this.outputGroup.push(this.resultGroup);
        this.outputGroup = this.outputGroup.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

        if (outputTeacher.length > 1) {
            outputTeacher = outputTeacher.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
            outputTeacher = new ConvertTeacherInGroup().convert(outputTeacher);
            this.outputGroup = new MergeObjectGroup(outputTeacher, this.outputGroup).merge(this.isMaxNum);
        }

        if (outputEdit.length > 1) {
            outputEdit = outputEdit.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
            outputEdit = new ConvertTeacherInGroup().convert(outputEdit);

            this.outputGroup = new MergeObjectGroup(outputEdit, this.outputGroup).merge(this.isMaxNum);
        }

        if (this.isMaxNum) {
            this.outputGroup = new CreateNulls(this.outputGroup).create();

            if (this.isTestJson) {
                new SaveJson(this.outputGroup).save("Ученики");
            }
            // Твой код
            await pushGroups(this.groupConvert(this.outputGroup));
            await manageScheduleStudents(this.outputGroup, date);
        }
    }
    public groupConvert(result: any) {
        const res: { route: string; course: string }[] = [];

        for (const group in result) {
            const match = group.match(/^([А-Яа-яA-Za-z]+)(\d+.*)$/);
            if (match && match[1] && match[2]) {
                res.push({
                    route: match[1],
                    course: match[2],
                });
            }
        }

        return res;
    }
}