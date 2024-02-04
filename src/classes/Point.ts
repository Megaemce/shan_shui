import IPoint from "../interfaces/IPoint";

/**
 * Class representing a 2D point with x and y coordinates.
 */
export default class Point implements IPoint {
    /**
     * Creates a new Point instance.
     * @param {number} [x=0] - The x-coordinate.
     * @param {number} [y=0] - The y-coordinate.
     */
    constructor(public x: number = 0, public y: number = 0) {}
}
