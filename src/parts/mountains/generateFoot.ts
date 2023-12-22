import { Point } from "../../classes/Point";
import { Noise } from "../../classes/PerlinNoise";
import { generateStroke } from "../brushes/generateStroke";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";

/**
 * Generates a representation of a foot using a given set of points.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {Point[][]} pointArray - An array of arrays representing the points.
 * @param {number} xOffset - X-coordinate offset for the foot.
 * @param {number} yOffset - Y-coordinate offset for the foot.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the foot.
 */

export function generateFoot(
    prng: PRNG,
    pointArray: Point[][],
    xOffset: number = 0,
    yOffset: number = 0
): SvgPolyline[] {
    const footArray: Point[][] = [];
    const span = 10;
    let ni = 0;

    for (let i = 0; i < pointArray.length - 2; i += 1) {
        if (i !== ni) continue;

        ni = Math.min(ni + prng.randomChoice([1, 2]), pointArray.length - 1);

        footArray.push([]);
        footArray.push([]);

        for (let j = 0; j < Math.min(pointArray[i].length / 8, 10); j++) {
            footArray[footArray.length - 2].push(
                new Point(
                    pointArray[i][j].x + Noise.noise(prng, j * 0.1, i) * 10,
                    pointArray[i][j].y
                )
            );
            footArray[footArray.length - 1].push(
                new Point(
                    pointArray[i][pointArray[i].length - 1 - j].x -
                        Noise.noise(prng, j * 0.1, i) * 10,
                    pointArray[i][pointArray[i].length - 1 - j].y
                )
            );
        }

        footArray[footArray.length - 2].reverse();
        footArray[footArray.length - 1].reverse();

        for (let j = 0; j < span; j++) {
            const p = j / span;
            const x1 = pointArray[i][0].x * (1 - p) + pointArray[ni][0].x * p;
            let y1 = pointArray[i][0].y * (1 - p) + pointArray[ni][0].y * p;

            const x2 =
                pointArray[i][pointArray[i].length - 1].x * (1 - p) +
                pointArray[ni][pointArray[i].length - 1].x * p;
            let y2 =
                pointArray[i][pointArray[i].length - 1].y * (1 - p) +
                pointArray[ni][pointArray[i].length - 1].y * p;

            const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
            y1 += vib * 5 + Noise.noise(prng, xOffset * 0.05, i) * 5;
            y2 += vib * 5 + Noise.noise(prng, xOffset * 0.05, i) * 5;

            footArray[footArray.length - 2].push(new Point(x1, y1));
            footArray[footArray.length - 1].push(new Point(x2, y2));
        }
    }

    const polylines: SvgPolyline[] = [];

    for (let i = 0; i < footArray.length; i++) {
        polylines.push(
            new SvgPolyline(footArray[i], xOffset, yOffset, "white", "none")
        );
    }

    for (let j = 0; j < footArray.length; j++) {
        const color = `rgba(100,100,100,${prng.random(0.1, 0.2).toFixed(3)})`;
        polylines.push(
            generateStroke(
                prng,
                footArray[j].map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                color,
                color,
                1
            )
        );
    }

    return polylines;
}
