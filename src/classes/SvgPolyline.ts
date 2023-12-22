import { ISvgElement } from "../interfaces/ISvgElement";
import { ISvgAttributes } from "../interfaces/ISvgAttributes";
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
    points: SvgPoint[];

    /**
     * Initializes a new instance of the SvgPolyline class.
     * @param points - Array of SvgPoint objects defining the polyline.
     * @param xOffset - The x-axis offset.
     * @param yOffset - The y-axis offset.
     * @param fillColor - The fill color.
     * @param strokeColor - The stroke color.
     * @param strokeWidth - The stroke width.
     */
    constructor(
        points: Point[],
        xOffset: number = 0,
        yOffset: number = 0,
        fillColor: string = "rgba(0,0,0,0)",
        strokeColor: string = "rgba(0,0,0,0)",
        strokeWidth: number = 0
    ) {
        this.points = points.map((p) =>
            SvgPoint.from(p.move(new Vector(xOffset, yOffset)))
        );
        this.attr = {
            style: {
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
            },
        };
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
}
