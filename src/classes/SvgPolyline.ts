import Point from "./Point";
import { config } from "../config";

const DEFAULT_FILL_COLOR = config.svgPolyline.defaultFillColor;
const DEFAULT_STROKE_COLOR = config.svgPolyline.defaultStrokeColor;
const DEFAULT_STROKE_WIDTH = config.svgPolyline.defaultStrokeWidth;

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
     * @param {string} [fillColor=DEFAULT_FILL_COLOR] - The fill color.
     * @param {string} [strokeColor=DEFAULT_STROKE_COLOR] - The stroke color.
     * @param {number} [strokeWidth=DEFAULT_STROKE_WIDTH] - The stroke width.
     */
    constructor(
        pointArray: Point[],
        xOffset: number = 0,
        yOffset: number = 0,
        fillColor: string = DEFAULT_FILL_COLOR,
        strokeColor: string = DEFAULT_STROKE_COLOR,
        strokeWidth: number = DEFAULT_STROKE_WIDTH
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
}
