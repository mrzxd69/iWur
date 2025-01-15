export interface IServiceRegistry {
    id: number,
    group?: {
        route: string,
        course: string,
    },
    initials?: string
}


export type TGroupsSchedule = Record<string, Record<string, {
    subject: string,
    subgroup?: string | undefined,
    room: string | undefined,
    teacher?: string | undefined
}[][]>>;


export type TLesson = Array<{
    subject: string;
    subgroup?: string | undefined;
    room: string | undefined;
    teacher?: string | undefined;
}>;