import ComplexSvg from "../ComplexSvg";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import { lineDivider } from "../../utils/polytools";

/**
 * Represents Pagoda Roof SVG elements.
 */
export default class PagodaRoof extends ComplexSvg {
    /**
     * @param {number} xOffset - The x-coordinate offset.
     * @param {number} yOffset - The y-coordinate offset.
     * @param {number} [height=20] - The height of the Pagoda Roof.
     * @param {number} [width=120] - The width of the Pagoda Roof.
     * @param {number} [strokeWidth=3] - The stroke width of the Pagoda Roof.
     * @param {number} [perspective=4] - The perspective parameter for Pagoda Roof generation.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        height: number = 20,
        width: number = 120,
        strokeWidth: number = 3,
        perspective: number = 4
    ) {
        super();

        const cor = 10;
        const sid = 4;
        const pointArray: Point[][] = [];
        const polist: Point[] = [new Point(0, -height)];

        for (let i = 0; i < sid; i++) {
            const fx = width * ((i * 1) / (sid - 1) - 0.5);
            const fy =
                perspective * (1 - Math.abs((i * 1) / (sid - 1) - 0.5) * 2);
            const fxx = (width + cor) * ((i * 1) / (sid - 1) - 0.5);
            if (i > 0) {
                pointArray.push([
                    pointArray[pointArray.length - 1][2],
                    new Point(fxx, fy),
                ]);
            }
            pointArray.push([
                new Point(0, -height),
                new Point(fx * 0.5, (-height + fy) * 0.5),
                new Point(fxx, fy),
            ]);
            polist.push(new Point(fxx, fy));
        }

        this.add(new SvgPolyline(polist, xOffset, yOffset, "white", "none"));

        for (let i = 0; i < pointArray.length; i++) {
            this.add(
                new Stroke(
                    lineDivider(pointArray[i], 5).map(
                        (point) =>
                            new Point(point.x + xOffset, point.y + yOffset)
                    ),
                    "rgba(100,100,100,0.4)",
                    "rgba(100,100,100,0.4)",
                    strokeWidth,
                    1,
                    1,
                    (_) => 1
                )
            );
        }
    }
}
