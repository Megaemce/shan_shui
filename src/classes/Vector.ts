import IPoint from "../interfaces/IPoint";
import Point from "./Point";

/**
 * Class representing a 2D vector with x and y components.
 */

export default class Vector implements IPoint {
    /**
     * Creates a new Vector instance.
     * @param x - The x-component of the vector.
     * @param y - The y-component of the vector.
     */
    constructor(public x: number, public y: number) {}

    /**
     * Converts the vector to an array of numbers [x, y].
     * @returns The vector as an array.
     */
    toArray(): number[] {
        return [this.x, this.y];
    }

    /**
     * Calculates the length (magnitude) of the vector.
     * @returns The length of the vector.
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Moves a specified point by this vector.
     * @param source - The source point to move from.
     * @returns A new point after the move operation.
     */
    moveFrom(source: Point): Point {
        return source.move(this);
    }

    /**
     * Moves the vector by another vector.
     * @param vector - The vector to move by.
     * @returns A new vector after the move operation.
     */
    move(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Scales the vector by a specified ratio.
     * @param ratio - The scaling ratio.
     * @returns A new vector after the scaling operation.
     */
    scale(ratio: number): Vector {
        return new Vector(this.x * ratio, this.y * ratio);
    }

    /**
     * Creates a unit vector based on the specified angle.
     * @param angle - The angle in radians.
     * @returns A unit vector with the given angle.
     */
    static unit(angle: number = 0): Vector {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}
