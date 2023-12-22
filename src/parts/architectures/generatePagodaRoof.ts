import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";

/**
 * Generates Pagoda Roof SVG elements.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [height=20] - The height of the Pagoda Roof.
 * @param {number} [width=120] - The width of the Pagoda Roof.
 * @param {number} [strokeWidth=3] - The stroke width of the Pagoda Roof.
 * @param {number} [perturbation=4] - The perturbation parameter for Pagoda Roof generation.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing Pagoda Roof.
 */
export function generatePagodaRoof(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    strokeWidth: number = 3,
    perturbation: number = 4
): SvgPolyline[] {
    const cor = 10;
    const sid = 4;
    const pointArray: Point[][] = [];
    const polist: Point[] = [new Point(0, -height)];
    const polylines: SvgPolyline[] = [];

    for (let i = 0; i < sid; i++) {
        const fx = width * ((i * 1) / (sid - 1) - 0.5);
        const fy = perturbation * (1 - Math.abs((i * 1) / (sid - 1) - 0.5) * 2);
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

    polylines.push(
        SvgPolyline.createPolyline(polist, xOffset, yOffset, "white", "none")
    );

    for (let i = 0; i < pointArray.length; i++) {
        polylines.push(
            generateStroke(
                prng,
                div(pointArray[i], 5).map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
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

    return polylines;
}
