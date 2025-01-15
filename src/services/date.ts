import { format as formatTime, parse } from "@formkit/tempo";

export const getDate = (tomorrow: boolean) => {
    const date = new Date();

    if (tomorrow) date.setDate(date.getDate() + 1);

    return formatTime({
        date,
        format: "full",
        tz: "Asia/Omsk",
        locale: "ru",
    }).split(" 2025")[0];
};

export const getDayMonth = (tomorrow: boolean) => {
    const date = new Date();

    if (tomorrow) date.setDate(date.getDate() + 1);

    return formatTime({
        date,
        format: "short",
        tz: "Asia/Omsk",
        locale: "ru",
    }).slice(0, -5);
};


export const getDefineDate = (date: string) => {
    const year = new Date().getFullYear();

    const a = parse({
        date: `${date}.${year}`,
        format: "short",
        locale: "ru",
    });

    return formatTime({
        date: a,
        format: "full",
        tz: "Asia/Omsk",
        locale: "ru",
    }).slice(0, -8);
}

export const getNextDay = (date: string) => {
    const year = new Date().getFullYear();

    const a = parse({
        date: `${date}.${year}`,
        format: "short",
        locale: "ru",
    });

    const nextDay = new Date(a.getTime() + 24 * 60 * 60 * 1000);

    return formatTime({
        date: nextDay,
        format: "short",
        tz: "Asia/Omsk",
        locale: "ru",
    }).slice(0, -5);
}

export const getPrevDay = (date: string) => {
    const year = new Date().getFullYear();

    const a = parse({
        date: `${date}.${year}`,
        format: "short",
        locale: "ru",
    });

    const nextDay = new Date(a.getTime() - 24 * 60 * 60 * 1000);

    return formatTime({
        date: nextDay,
        format: "short",
        tz: "Asia/Omsk",
        locale: "ru",
    }).slice(0, -5);
}