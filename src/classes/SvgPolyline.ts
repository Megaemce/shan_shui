import Point from "./Point";
import { config } from "../config";

const DEFAULTFILLCOLOR = config.svgPolyline.defaultFillColor;
const DEFAULTSTROKECOLOR = config.svgPolyline.defaultStrokeColor;
const DEFAULTSTROKEWIDTH = config.svgPolyline.defaultStrokeWidth;

/**
 * Represents a polyline in SVG.
 */
export default class SvgPolyline {
    style: string = "";
    /** Array of points defining the polyline. */
    points: Point[];

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
        if (xOffset === 0 && yOffset === 0) {
            this.points = pointArray;
        } else {
            this.points = pointArray.map(
                (point) => new Point(point.x + xOffset, point.y + yOffset)
            );
        }

        this.style = `style='fill:${fillColor};stroke:${strokeColor};stroke-width:${strokeWidth}'`;
    }

    /**
     * Renders the polyline as a string.
     * @returns {string} The string representation of the polyline.
     */
    render(): string {
        return `<polyline points='${this.points
            .map((point) => point.render())
            .join(" ")}' ${this.style}/>`;
    }
}
