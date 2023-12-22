import { Noise } from "../../classes/PerlinNoise";
import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateStroke } from "../brushes/generateStroke";
import { div } from "../brushes/div";

/**
 * Generates Rail SVG elements.
 * @notExported
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [seed=0] - The seed for randomization.
 * @param {boolean} [hasTrack=true] - Indicates whether to generate track segments.
 * @param {number} [height=20] - The height of the rail.
 * @param {number} [width=180] - The width of the rail.
 * @param {number} [perturbation=4] - The perturbation parameter for rail generation.
 * @param {number} [segments=4] - The number of segments in the rail.
 * @param {boolean} [hasFront=true] - Indicates whether to generate front rail segments.
 * @param {number} [rotation=0.7] - The rotation parameter for rail.
 * @param {number} [strokeWidth=1] - The stroke width of the rail.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing the rail.
 */
export function generateRail(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    hasTrack: boolean = true,
    height: number = 20,
    width: number = 180,
    perturbation: number = 4,
    segments: number = 4,
    hasFront: boolean = true,
    rotation: number = 0.7,
    strokeWidth: number = 1
): SvgPolyline[] {
    const mid = -width * 0.5 + width * rotation;
    const bmid = -width * 0.5 + width * (1 - rotation);
    const pointArray: Point[][] = [];

    if (hasFront) {
        pointArray.push(
            div(
                [new Point(-width * 0.5, 0), new Point(mid, perturbation)],
                segments
            )
        );
        pointArray.push(
            div(
                [new Point(mid, perturbation), new Point(width * 0.5, 0)],
                segments
            )
        );
    }

    if (hasTrack) {
        pointArray.push(
            div(
                [new Point(-width * 0.5, 0), new Point(bmid, -perturbation)],
                segments
            )
        );
        pointArray.push(
            div(
                [new Point(bmid, -perturbation), new Point(width * 0.5, 0)],
                segments
            )
        );
    }

    if (hasFront) {
        pointArray.push(
            div(
                [
                    new Point(-width * 0.5, -height),
                    new Point(mid, -height + perturbation),
                ],
                segments
            )
        );
        pointArray.push(
            div(
                [
                    new Point(mid, -height + perturbation),
                    new Point(width * 0.5, -height),
                ],
                segments
            )
        );
    }

    if (hasTrack) {
        pointArray.push(
            div(
                [
                    new Point(-width * 0.5, -height),
                    new Point(bmid, -height - perturbation),
                ],
                segments
            )
        );
        pointArray.push(
            div(
                [
                    new Point(bmid, -height - perturbation),
                    new Point(width * 0.5, -height),
                ],
                segments
            )
        );
    }

    if (hasTrack) {
        const open = Math.floor(prng.random(0, pointArray.length));
        pointArray[open] = pointArray[open].slice(0, -1);
        pointArray[(open + pointArray.length) % pointArray.length] = pointArray[
            (open + pointArray.length) % pointArray.length
        ].slice(0, -1);
    }

    const polylines: SvgPolyline[] = [];
    const halfLength = pointArray.length / 2;

    for (let i = 0; i < halfLength; i++) {
        const rotatedIndex = (halfLength + i) % pointArray.length;
        const rotatedArray = pointArray[rotatedIndex];
        const currentArray = pointArray[i];

        for (let j = 0; j < currentArray.length; j++) {
            const currentPoint = currentArray[j];
            const rotatedPoint = rotatedArray[j % rotatedArray.length];

            const noiseI = i + j * 0.5;
            const noiseJ = j * 0.5;
            const yNoise1 = Noise.noise(prng, noiseI, noiseJ, seed) - 0.5;
            const yNoise2 = Noise.noise(prng, noiseI + 0.5, noiseJ, seed) - 0.5;

            currentPoint.y += yNoise1 * height;
            rotatedPoint.y += yNoise2 * height;

            const ln = div([currentPoint, rotatedPoint], 2);
            ln[0].x += prng.random(-0.25, 0.25) * height;

            polylines.push(
                new SvgPolyline(
                    ln,
                    xOffset,
                    yOffset,
                    "none",
                    "rgba(100,100,100,0.5)",
                    2
                )
            );
        }
    }

    for (let i = 0; i < pointArray.length; i++) {
        polylines.push(
            generateStroke(
                prng,
                pointArray[i].map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                "rgba(100,100,100,0.5)",
                "rgba(100,100,100,0.5)",
                strokeWidth,
                0.5,
                1,
                (_) => 1
            )
        );
    }

    return polylines;
}
