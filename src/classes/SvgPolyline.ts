import ISvgAttributes from "../interfaces/ISvgAttributes";
import ISvgElement from "../interfaces/ISvgElement";
import Point from "./Point";
import SvgPoint from "./SvgPoint";
import Vector from "./Vector";
import { attributesToString } from "../utils/utils";
import { config } from "../config";

const DEFAULTFILLCOLOR = config.svgPolyline.defaultFillColor;
const DEFAULTSTROKECOLOR = config.svgPolyline.defaultStrokeColor;
const DEFAULTSTROKEWIDTH = config.svgPolyline.defaultStrokeWidth;

/**
 * Represents a polyline in SVG.
 * @implements {ISvgElement} - Interface representing an SVG element.
 */
export default class SvgPolyline implements ISvgElement {
    /** Attribute object for additional SVG attributes. */
    attr: Partial<ISvgAttributes> = {};
    /** Array of points defining the polyline. */
    points: SvgPoint[];

    /**
     * Initializes a new instance of the SvgPolyline class.
     * @param {Point[]} points - Array of SvgPoint objects defining the polyline.
     * @param {number} [xOffset=0] - The x-axis offset.
     * @param {number} [yOffset=0] - The y-axis offset.
     * @param {string} [fillColor=DEFAULTFILLCOLOR] - The fill color.
     * @param {string} [strokeColor=DEFAULTSTROKECOLOR] - The stroke color.
     * @param {number} [strokeWidth=DEFAULTSTROKEWIDTH] - The stroke width.
     */
    constructor(
        points: Point[],
        xOffset: number = 0,
        yOffset: number = 0,
        fillColor: string = DEFAULTFILLCOLOR,
        strokeColor: string = DEFAULTSTROKECOLOR,
        strokeWidth: number = DEFAULTSTROKEWIDTH
    ) {
        /**
         * Array of points defining the polyline.
         *
         * @type {SvgPoint[]}
         */
        this.points = points.map((point) =>
            SvgPoint.from(point.move(new Vector(xOffset, yOffset)))
        );

        /**
         * Attribute object for additional SVG attributes.
         *
         * @type {Partial<ISvgAttributes>}
         */
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
     * @returns {string} The string representation of the polyline.
     */
    render(): string {
        const attrstr = attributesToString(this.attr);

        return `<polyline points='${this.points
            .map((point) => point.render())
            .join(" ")}' ${attrstr}/>`;
    }
}
