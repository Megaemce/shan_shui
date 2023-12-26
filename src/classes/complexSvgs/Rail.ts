import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import { lineDivider } from "../../utils/polytools";
import ComplexSvg from "../ComplexSvg";

/**
 * Represents Rail SVG elements.
 */
export default class Rail extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - The x-coordinate offset.
     * @param {number} yOffset - The y-coordinate offset.
     * @param {number} [seed=0] - The seed for randomization.
     * @param {boolean} [hasTrack=true] - Indicates whether to generate track segments.
     * @param {number} [height=20] - The height of the rail.
     * @param {number} [width=180] - The width of the rail.
     * @param {number} [perspective=4] - The perspective parameter for rail generation.
     * @param {number} [segments=4] - The number of segments in the rail.
     * @param {boolean} [hasFront=true] - Indicates whether to generate front rail segments.
     * @param {number} [rotation=0.7] - The rotation parameter for rail.
     * @param {number} [strokeWidth=1] - The stroke width of the rail.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        seed: number = 0,
        hasTrack: boolean = true,
        height: number = 20,
        width: number = 180,
        perspective: number = 4,
        segments: number = 4,
        hasFront: boolean = true,
        rotation: number = 0.7,
        strokeWidth: number = 1
    ) {
        super();

        const mid = -width * 0.5 + width * rotation;
        const bmid = -width * 0.5 + width * (1 - rotation);
        const pointArray: Point[][] = [];

        if (hasFront) {
            pointArray.push(
                lineDivider(
                    [new Point(-width * 0.5, 0), new Point(mid, perspective)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(mid, perspective), new Point(width * 0.5, 0)],
                    segments
                )
            );
        }

        if (hasTrack) {
            pointArray.push(
                lineDivider(
                    [new Point(-width * 0.5, 0), new Point(bmid, -perspective)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(bmid, -perspective), new Point(width * 0.5, 0)],
                    segments
                )
            );
        }

        if (hasFront) {
            pointArray.push(
                lineDivider(
                    [
                        new Point(-width * 0.5, -height),
                        new Point(mid, -height + perspective),
                    ],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [
                        new Point(mid, -height + perspective),
                        new Point(width * 0.5, -height),
                    ],
                    segments
                )
            );
        }

        if (hasTrack) {
            pointArray.push(
                lineDivider(
                    [
                        new Point(-width * 0.5, -height),
                        new Point(bmid, -height - perspective),
                    ],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [
                        new Point(bmid, -height - perspective),
                        new Point(width * 0.5, -height),
                    ],
                    segments
                )
            );
        }

        if (hasTrack) {
            const open = Math.floor(prng.random(0, pointArray.length));
            pointArray[open] = pointArray[open].slice(0, -1);
            pointArray[(open + pointArray.length) % pointArray.length] =
                pointArray[
                    (open + pointArray.length) % pointArray.length
                ].slice(0, -1);
        }

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
                const yNoise2 =
                    Noise.noise(prng, noiseI + 0.5, noiseJ, seed) - 0.5;

                currentPoint.y += yNoise1 * height;
                rotatedPoint.y += yNoise2 * height;

                const ln = lineDivider([currentPoint, rotatedPoint], 2);
                ln[0].x += prng.random(-0.25, 0.25) * height;

                this.add(
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
            this.add(
                new Stroke(
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
    }
}
