import moment from "moment";

export const getTime = (): string =>
    moment.utc().format("YYYY-MM-DDTHH:mm:ss.SSS");

export const getTodayByInt = (): number =>
    parseInt(moment.utc().format("YYYYMMDD"));
