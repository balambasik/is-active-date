import { isActiveDate } from '../src';
import { describe, expect, test } from 'vitest';

describe('isActiveDate', () => {
    describe('no constraints', () => {
        test('returns true without parameters', () => {
            expect(isActiveDate({})).toBe(true);
        });

        test('returns true with null parameters', () => {
            expect(isActiveDate({ start: null, stop: null })).toBe(true);
        });
    });

    describe('start only', () => {
        const past = new Date('2020-01-01');
        const future = new Date('2099-01-01');
        const now = new Date('2025-01-01');

        test('returns true if now is after start', () => {
            expect(isActiveDate({ start: past, now })).toBe(true);
        });

        test('returns false if now is before start', () => {
            expect(isActiveDate({ start: future, now })).toBe(false);
        });

        test('returns true if now equals start', () => {
            expect(isActiveDate({ start: now, now })).toBe(true);
        });
    });

    describe('stop only', () => {
        const past = new Date('2020-01-01');
        const future = new Date('2099-01-01');
        const now = new Date('2025-01-01');

        test('returns true if now is before stop', () => {
            expect(isActiveDate({ stop: future, now })).toBe(true);
        });

        test('returns false if now is after stop', () => {
            expect(isActiveDate({ stop: past, now })).toBe(false);
        });

        test('returns true if now equals stop', () => {
            expect(isActiveDate({ stop: now, now })).toBe(true);
        });
    });

    describe('start-stop range', () => {
        test('returns true if within range', () => {
            expect(
                isActiveDate({
                    start: '2020-01-01',
                    stop: '2030-01-01',
                    now: '2025-01-01',
                })
            ).toBe(true);
        });

        test('returns false if after range', () => {
            expect(
                isActiveDate({
                    start: '2020-01-01',
                    stop: '2021-01-01',
                    now: '2022-01-01',
                })
            ).toBe(false);
        });

        test('returns false if before range', () => {
            expect(
                isActiveDate({
                    start: '2026-01-01',
                    stop: '2027-01-01',
                    now: '2025-01-01',
                })
            ).toBe(false);
        });
    });

    describe('data types', () => {
        const now = new Date('2025-01-01');
        const past = new Date('2020-01-01');

        test('supports string dates', () => {
            expect(
                isActiveDate({
                    start: '2020-01-01',
                    now: '2025-01-01',
                })
            ).toBe(true);
        });

        test('supports timestamp values', () => {
            expect(
                isActiveDate({
                    start: past.getTime(),
                    now: now.getTime(),
                })
            ).toBe(true);
        });
    });

    describe('precision', () => {
        test('millisecond: respects time', () => {
            const morning = new Date('2025-01-01T08:00:00.000Z');
            const evening = new Date('2025-01-01T20:00:00.000Z');

            expect(
                isActiveDate({
                    start: evening,
                    now: morning,
                    precision: 'millisecond',
                })
            ).toBe(false);
        });

        test('day: ignores time component', () => {
            const morning = new Date('2025-01-01T08:00:00.000Z');
            const evening = new Date('2025-01-01T20:00:00.000Z');

            expect(
                isActiveDate({
                    start: evening,
                    now: morning,
                    precision: 'day',
                })
            ).toBe(true);
        });
    });

    describe('entity example', () => {
        interface Promotion {
            name: string;
            startDate: string;
            endDate: string;
        }

        const promo: Promotion = {
            name: 'Summer Sale',
            startDate: '2025-06-01',
            endDate: '2025-08-31',
        };

        test('returns true if current date is within promo dates', () => {
            expect(
                isActiveDate({
                    start: promo.startDate,
                    stop: promo.endDate,
                    now: '2025-07-15',
                })
            ).toBe(true);
        });

        test('returns false if current date is after promo dates', () => {
            expect(
                isActiveDate({
                    start: promo.startDate,
                    stop: promo.endDate,
                    now: '2025-09-01',
                })
            ).toBe(false);
        });
    });

    describe('errors', () => {
        test('throws TypeError for invalid now date', () => {
            expect(() => {
                isActiveDate({ now: 'invalid date' });
            }).toThrow(TypeError);
        });
    });
});