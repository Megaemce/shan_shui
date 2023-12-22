import { ISvgElement } from "../interfaces/ISvgElement";
import { ISvgAttributes } from "../interfaces/ISvgAttributes";
import { ISvgStyles } from "../interfaces/ISvgStyles";
import { attributesToString } from "../utils/utils";
import { Point } from "./Point";
import { Vector } from "./Vector";
import { SvgPoint } from "./SvgPoint";

/**
 * Represents a polyline in SVG.
 */

export class SvgPolyline implements ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes> = {};
    /** Array of points defining the polyline. */
    points: SvgPoint[] = [];

    /**
     * Initializes a new instance of the SvgPolyline class.
     * @param points - Array of SvgPoint objects defining the polyline.
     * @param style - Style attributes for the polyline.
     */
    constructor(points: SvgPoint[], style: Partial<ISvgStyles>) {
        this.points = points;
        this.attr = { style };
    }

    /**
     * Renders the polyline as a string.
     * @returns The string representation of the polyline.
     */
    render(): string {
        const attrstr = attributesToString(this.attr);
        return `<polyline points='${this.points
            .map((p) => p.render())
            .join(" ")}' ${attrstr}/>`;
    }

    /**
     * Create an SVG polyline from a list of points.
     * @param {Point[]} pointArray - The list of points.
     * @param {number} [xOffset=0] - The x-axis offset.
     * @param {number} [yOffset=0] - The y-axis offset.
     * @param {string} [fillColor="rgba(0,0,0,0)"] - The fill color.
     * @param {string} [strokeColor="rgba(0,0,0,0)"] - The stroke color.
     * @param {number} [strokeWidth=0] - The stroke width.
     * @returns {SvgPolyline} An SVG polyline.
     */
    static createPolyline(
        pointArray: Point[],
        xOffset: number = 0,
        yOffset: number = 0,
        fillColor: string = "rgba(0,0,0,0)",
        strokeColor: string = "rgba(0,0,0,0)",
        strokeWidth: number = 0
    ): SvgPolyline {
        const off = new Vector(xOffset, yOffset);
        const fill = fillColor;
        const stroke = strokeColor;
        const style = { fill, stroke, strokeWidth };
        const svgPoints = pointArray.map((p) => SvgPoint.from(p.move(off)));
        return new SvgPolyline(svgPoints, style);
    }
}
