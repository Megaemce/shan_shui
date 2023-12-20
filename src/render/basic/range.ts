/**
 * Represents a range with left and right boundaries.
 */
export interface IRange {
    left: number;
    right: number;
}

/**
 * Class representing a numeric range.
 */
export class Range implements IRange {
    /**
     * Creates a new Range.
     * @param left - The left boundary of the range.
     * @param right - The right boundary of the range.
     */
    constructor(public left: number = 0, public right: number = 1) {}

    /**
     * Gets the length of the range.
     */
    get length(): number {
        return this.right - this.left;
    }

    /**
     * Creates a copy of the range.
     * @returns A new Range instance with the same boundaries.
     */
    copy(): Range {
        return new Range(this.left, this.right);
    }

    /**
     * Checks if a value is within the range.
     * @param value - The value to check.
     * @returns True if the value is within the range, false otherwise.
     */
    contains(value: number): boolean {
        return value >= this.left && value <= this.right;
    }

    /**
     * Maps a value to a ratio within the range.
     * @param value - The value to map.
     * @returns The ratio representing the position of the value within the range.
     */
    mapToRatio(value: number): number {
        return (value - this.left) / this.length;
    }

    /**
     * Maps a ratio to a value within the range.
     * @param ratio - The ratio to map.
     * @returns The value within the range corresponding to the given ratio.
     */
    mapFromRatio(ratio: number): number {
        return ratio * this.length + this.left;
    }

    /**
     * Map a value from one range to another.
     * @param {number} value - The value to map.
     * @param {Range} outputRange - The output range.
     * @returns {number} The mapped value.
     */
    mapValue(value: number, outputRange: Range): number {
        return outputRange.mapFromRatio(this.mapToRatio(value));
    }

    /**
     * Creates a new Range instance from an array.
     * @param array - An array containing left and right boundaries.
     * @returns A new Range instance.
     */
    static fromArray(array: [number, number]): Range {
        return new Range(array[0], array[1]);
    }
}

/**
 * Class representing boundaries in the x and y directions.
 */
export class Bound {
    /**
     * Creates a new Bound.
     * @param xMin - The minimum value for the x-axis.
     * @param xMax - The maximum value for the x-axis.
     * @param yMin - The minimum value for the y-axis.
     * @param yMax - The maximum value for the y-axis.
     */
    constructor(
        public xMin: number = 0,
        public xMax: number = 0,
        public yMin: number = 0,
        public yMax: number = 0
    ) {}
}
