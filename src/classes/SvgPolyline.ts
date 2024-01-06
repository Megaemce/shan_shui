import Point from "./Point";
import { config } from "../config";

const DEFAULTFILLCOLOR = config.svgPolyline.defaultFillColor;
const DEFAULTSTROKECOLOR = config.svgPolyline.defaultStrokeColor;
const DEFAULTSTROKEWIDTH = config.svgPolyline.defaultStrokeWidth;

/**
 * Represents a polyline in SVG.
 */
export default class SvgPolyline {
    /** String representation of the polyline. */
    stringify: string = "";
    /** Array of points defining the polyline. */

    /**
     * Initializes a new instance of the SvgPolyline class.
     * @param {Point[]} pointArray - Array of SvgPoint objects defining the polyline.
     * @param {number} [xOffset=0] - The x-axis offset.
     * @param {number} [yOffset=0] - The y-axis offset.
     * @param {string} [fillColor=DEFAULTFILLCOLOR] - The fill color.
     * @param {string} [strokeColor=DEFAULTSTROKECOLOR] - The stroke color.
     * @param {number} [strokeWidth=DEFAULTSTROKEWIDTH] - The stroke width.
     */
    constructor(
        pointArray: Point[],
        xOffset: number = 0,
        yOffset: number = 0,
        fillColor: string = DEFAULTFILLCOLOR,
        strokeColor: string = DEFAULTSTROKECOLOR,
        strokeWidth: number = DEFAULTSTROKEWIDTH
    ) {
        const style = `style='
            fill:${fillColor};
            stroke:${strokeColor};
            stroke-width:${strokeWidth}
        '`;

        this.stringify = `<polyline points='
            ${pointArray
                .map(
                    (point) =>
                        (point.x + xOffset).toFixed(1) +
                        "," +
                        (point.y + yOffset).toFixed(1)
                )
                .join(" ")}
            '${style}/>`;
    }

    /**
     * Renders the polyline as a string.
     * @returns {string} The string representation of the polyline.
     */
    render(): string {
        return this.stringify;
    }
}
