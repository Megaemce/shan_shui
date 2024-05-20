import Point from "./Point";
import Range from "./Range";
import { config } from "../config";

const DEFAULT_FILL_COLOR = config.element.defaultFillColor;
const DEFAULT_STROKE_COLOR = config.element.defaultStrokeColor;
const DEFAULT_STROKE_WIDTH = config.element.defaultStrokeWidth;

/**
 * Represents a polyline in SVG.
 */
export default class Element {
    /** String representation of the polyline. */
    stringify: string = "";
    /** Keeping the range of the element so it could be hidden is not within working area */
    range: Range = new Range(0, 0);

    /**
     * Initializes a new instance of the Elemnt class.
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
        const style = `style='fill:${fillColor}; stroke:${strokeColor}; stroke-width:${strokeWidth}'`;

        let points = "";
        let xMin = +Infinity;
        let xMax = -Infinity;

        for (let i = 0; i < pointArray.length; i++) {
            let x = pointArray[i].x + xOffset;
            let y = pointArray[i].y + yOffset;

            if (xMin > x) xMin = x;
            if (xMax < x) xMax = x;
            points += `${x.toFixed(1)},${y.toFixed(1)} `;
        }

        this.range = new Range(xMin, xMax);
        this.stringify = `<polyline points='${points}' ${style}/>`;
    }
}
