import { Range } from "./Range";

/**
 * Pseudo-Random Number Generator (PRNG) class.
 */
export class PRNG {
    private _seed: number = 1234;
    private readonly primeOne: number = 999979;
    private readonly primeTwo: number = 999983;
    private readonly semiprime: number = this.primeOne * this.primeTwo;

    /**
     * Hashes the input value for use in seeding.
     * @param {string | number} value - The input value to be hashed.
     * @returns The hashed value.
     */
    private hash(value: string | number): number {
        const stringFromValue = JSON.stringify(value);
        const numberFromString = stringFromValue
            .split("")
            .reduce(
                (acc, char, i) => acc + char.charCodeAt(0) * Math.pow(128, i),
                0
            );
        return numberFromString;
    }

    /**
     * Sets the seed value for the Pseudorandom Number Generator (PRNG).
     * If the value is undefined, the current timestamp is used as the seed.
     *
     * @param {string | number} value - The value to use for seeding.
     */
    set seed(value: string | number) {
        if (value === undefined) {
            value = new Date().getTime();
        }

        let newSeed = 0;
        let z = 0;

        /**
         * Redo the seeding process if the generated value is not suitable.
         */
        const redo = () => {
            newSeed = (this.hash(value) + z) % this.semiprime;
            z += 1;
        };

        while (
            newSeed % this.primeOne === 0 ||
            newSeed % this.primeTwo === 0 ||
            newSeed === 0 ||
            newSeed === 1
        ) {
            redo();
        }

        this._seed = newSeed;

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
        this._seed = (this._seed * this._seed) % this.semiprime;
        return this._seed / this.semiprime;
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
        return inputRange.mapValue(this.random(), outputRange);
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
