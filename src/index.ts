export type DateLike = Date | string | number;
export type DatePrecision = 'millisecond' | 'day';

export interface IsActiveDateOptions {
    start?: DateLike | null;
    stop?: DateLike | null;
    now?: DateLike;
    precision?: DatePrecision;
}

const toDate = (value: DateLike | null | undefined): Date | null => {
    if (value == null) {
        return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const normalize = (date: Date, precision: DatePrecision): Date => {
    if (precision === 'millisecond') {
        return date;
    }

    const result = new Date(date);
    result.setHours(0, 0, 0, 0);

    return result;
}

export const isActiveDate = ({
                                 start,
                                 stop,
                                 now = new Date(),
                                 precision = 'millisecond',
                             }: IsActiveDateOptions): boolean => {

    const startDate = toDate(start);
    const stopDate = toDate(stop);
    const currentDate = toDate(now);

    if (!currentDate) {
        throw new TypeError('Invalid "now" date');
    }

    const current = normalize(currentDate, precision).getTime();
    const startTime = startDate ? normalize(startDate, precision).getTime() : null;
    const stopTime = stopDate ? normalize(stopDate, precision).getTime() : null;

    if (startTime === null && stopTime === null) {
        return true;
    }

    if (startTime !== null && stopTime === null) {
        return current >= startTime;
    }

    if (startTime === null && stopTime !== null) {
        return current <= stopTime;
    }

    return current >= startTime! && current <= stopTime!;
}