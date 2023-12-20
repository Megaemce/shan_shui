import { Point, Vector } from "../basic/point";
import { SvgPolyline, SvgPoint } from "./types";

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
export function createPolyline(
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
    const polyline = new SvgPolyline(svgPoints, style);

    return polyline;
}
