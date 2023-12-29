import IRange from "../interfaces/IRange";

/**
 * Class representing a numeric range.
 */
export default class Range implements IRange {
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
}
