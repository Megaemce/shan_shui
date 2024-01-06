import IPoint from "../interfaces/IPoint";

/**
 * Class representing a 2D point with x and y coordinates.
 */
export default class Point implements IPoint {
    /**
     * Creates a new Point instance.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     */
    constructor(public x: number = 0, public y: number = 0) {}
}
