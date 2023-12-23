import IPoint from "../interfaces/IPoint";
import Vector from "./Vector";

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

    /**
     * Converts the point to an array of numbers [x, y].
     * @returns The point as an array.
     */
    toArray(): number[] {
        return [this.x, this.y];
    }

    /**
     * Creates a vector from this point to the specified destination point.
     * @param destination - The destination point.
     * @returns The vector from this point to the destination point.
     */
    to(destination: Point): Vector {
        return new Vector(destination.x - this.x, destination.y - this.y);
    }

    /**
     * Creates a vector from the specified source point to this point.
     * @param source - The source point.
     * @returns The vector from the source point to this point.
     */
    from(source: Point): Vector {
        return source.to(this);
    }

    /**
     * Moves the point by a given vector.
     * @param vector - The vector to move the point by.
     * @returns A new point after the move operation.
     */
    move(vector: Vector): Point {
        return new Point(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Checks if both x and y coordinates are finite numbers.
     * @returns `true` if both x and y are finite, `false` otherwise.
     */
    isFinite(): boolean {
        return isFinite(this.x) && isFinite(this.y);
    }

    /**
     * Creates a copy of this point.
     * @returns A new point with the same x and y coordinates.
     */
    copy(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * Creates a Point instance from an array of numbers [x, y].
     * @param array - The array containing x and y values.
     * @returns A new Point instance.
     */
    static fromArray(array: [number, number]): Point {
        return new Point(array[0], array[1]);
    }

    /**
     * Creates a Point instance representing the origin (0, 0).
     * @returns A new Point instance at the origin.
     */
    static origin(): Point {
        return new Point(0, 0);
    }

    /**
     * Constant Point instance representing the origin (0, 0).
     */
    static readonly O: Point = Point.origin();
}
