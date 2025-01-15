export type TLesson = [string, string | undefined, string, string];
export type TLessons = { [key: string]: TLesson | TLesson[] }