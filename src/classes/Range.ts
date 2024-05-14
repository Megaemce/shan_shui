import IRange from "../interfaces/IRange";

/**
 * Class representing a numeric range.
 */
export default class Range implements IRange {
    /**
     * Creates a new Range.
     * @param {number} [start=0] - The beginning boundary of the range.
     * @param {number} [end=1] - The end boundary of the range.
     */
    constructor(public start: number = 0, public end: number = 1) {}

    /**
     * Gets the length of the range.
     */
    get length(): number {
        return this.end - this.start;
    }

    /**
     * Move the range by given number
     * @param {number} value
     * @returns {Range}
     */
    public move(value: number): Range {
        this.start += value;
        this.end += value;

        return this;
    }

    /**
     * Check if the given range is contained in this range
     * @param {Range} range - range to check
     * @returns {boolean}
     */
    public contains(range: Range): boolean {
        // range.end < this.end to render before "on the edge" situation eg. [0,1500], [700,1500]
        if (this.start <= range.start && range.end < this.end) {
            return true;
        }
        return false;
    }

    /**
     * Check if the given range is within this range (it's visible)
     * @param {Range} range - range to check
     */
    public isShowing(range: Range): boolean {
        return (
            (this.start <= range.start && range.start <= this.end) ||
            (this.start <= range.end && range.end <= this.end) ||
            (range.start <= this.start && range.end >= this.end)
        );
    }
}
