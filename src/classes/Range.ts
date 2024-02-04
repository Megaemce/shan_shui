import IRange from "../interfaces/IRange";

/**
 * Class representing a numeric range.
 */
export default class Range implements IRange {
    /**
     * Creates a new Range.
     * @param {number} [left=0] - The left boundary of the range.
     * @param {number} [right=1] - The right boundary of the range.
     */
    constructor(public left: number = 0, public right: number = 1) {}

    /**
     * Gets the length of the range.
     */
    get length(): number {
        return this.right - this.left;
    }
}
