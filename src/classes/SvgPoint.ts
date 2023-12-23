import ISvgElement from "../interfaces/ISvgElement";
import IPoint from "../interfaces/IPoint";

/**
 * Represents a point in SVG coordinates.
 */
export default class SvgPoint implements ISvgElement, IPoint {
    /**
     * Initializes a new instance of the SvgPoint class.
     * @param _x - The x-coordinate of the point.
     * @param _y - The y-coordinate of the point.
     */
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    /** The x-coordinate of the point. */
    x: number;
    /** The y-coordinate of the point. */
    y: number;

    /** Attribute object for additional SVG attributes. */
    attr = {};

    /**
     * Creates an SvgPoint instance from an IPoint object.
     * @param p - The IPoint object.
     * @returns A new SvgPoint instance.
     */
    static from(p: IPoint): SvgPoint {
        return new SvgPoint(p.x, p.y);
    }

    /**
     * Renders the point as a string.
     * @returns The string representation of the point.
     */
    render(): string {
        return `${this.x.toFixed(1)},${this.y.toFixed(1)}`;
    }
}
