import { mapValue } from "./utils";
import { Range } from "./range";

/**
 * Pseudo-Random Number Generator (PRNG) class.
 */
export class PRNG {
    private s: number = 1234;
    private readonly p: number = 999979;
    private readonly q: number = 999983;
    private readonly m: number = this.p * this.q;

    /**
     * Hashes the input value for use in seeding.
     * @param value - The input value to be hashed.
     * @returns The hashed value.
     */
    private hash(value: any): number {
        const y = JSON.stringify(value);
        return y
            .split("")
            .reduce(
                (acc, char, i) => acc + char.charCodeAt(0) * Math.pow(128, i),
                0
            );
    }

    /**
     * Seeds the PRNG with the specified value.
     * @param value - The value to use for seeding. If undefined, the current timestamp is used.
     * @param logCallback - Optional callback to log the seeding process.
     */
    seed(value: any, logCallback?: (message: string) => void): void {
        if (value === undefined) {
            value = new Date().getTime();
        }

        let y = 0;
        let z = 0;

        /**
         * Redo the seeding process if the generated value is not suitable.
         */
        const redo = () => {
            y = (this.hash(value) + z) % this.m;
            z += 1;
        };

        while (y % this.p === 0 || y % this.q === 0 || y === 0 || y === 1) {
            redo();
        }

        this.s = y;

        if (logCallback) {
            logCallback(`seed(${value}) = ${this.s}`);
        }

        // Skip the first few numbers after seeding
        for (let i = 0; i < 10; i++) {
            this.next();
        }
    }

    /**
     * Generates the next pseudo-random number in the sequence.
     * @returns The next pseudo-random number (float) in the sequence.
     */
    next(): number {
        this.s = (this.s * this.s) % this.m;
        return this.s / this.m;
    }

    /**
     * Generates a pseudo-random number within the specified range.
     * @param lowerBound - The lower calculateBoundingBox of the range.
     * @param upperBound - The upper calculateBoundingBox of the range.
     * @returns A pseudo-random number within the specified range.
     */
    random(lowerBound: number = 0, upperBound: number = 1): number {
        return this.next() * (upperBound - lowerBound) + lowerBound;
    }

    /**
     * Generates a pseudo-random number that is either -1 or 1.
     * @returns -1 or 1.
     */
    randomSign(): number {
        return this.random(0, 1) > 0.5 ? -1 : 1;
    }

    /**
     * Randomly choose an element from an array.
     * @param {T[]} array - The array with elements to choose from.
     * @returns {T} A randomly chosen element from the array.
     */
    randomChoice<T>(array: T[]): T {
        const number = Math.floor(this.random(0, array.length));
        return array[number];
    }

    /**
     * Generate a normalized random number within a range.
     * @param {number} minValue - The minimum value.
     * @param {number} maxValue - The maximum value.
     * @returns {number} A normalized random number within the specified range.
     */
    normalizedRandom(minValue: number, maxValue: number): number {
        const inputRange = new Range(0, 1);
        const outputRange = new Range(minValue, maxValue);
        return mapValue(this.random(), inputRange, outputRange);
    }

    /**
     * Generate a weighted random number based on a function.
     * @param {(value: number) => number} func - The weighting function.
     * @returns {number} A weighted random number.
     */
    weightedRandom(func: (value: number) => number): number {
        const x = this.random();
        const y = this.random();
        return y < func(x) ? x : this.weightedRandom(func);
    }

    /**
     * Generate a random number with a Gaussian distribution.
     * @returns {number} A random number with a Gaussian distribution.
     */
    gaussianRandom(): number {
        const value = this.weightedRandom((x) =>
            Math.exp(-24 * Math.pow(x - 0.5, 2))
        );
        return value * 2 - 1;
    }
}
