import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import { lineDivider } from "../../utils/polytools";

/**
 * Represents Rail SVG elements.
 */
export default class Rail extends Structure {
    /**
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

        const left = -width / 2;
        const right = width / 2;
        const top = -height;
        const bottom = 0;
        const front_x = left + width * rotation;
        const front_y = perspective;
        const back_x = left + width * (1 - rotation);
        const back_y = -perspective;

        const pointArray: Point[][] = [];

        if (hasFront) {
            pointArray.push(
                lineDivider(
                    [new Point(left, bottom), new Point(front_x, front_y)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(front_x, front_y), new Point(right, bottom)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(left, top), new Point(front_x, top + front_y)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(front_x, top + front_y), new Point(right, top)],
                    segments
                )
            );
        }

        if (hasTrack) {
            pointArray.push(
                lineDivider(
                    [new Point(left, bottom), new Point(back_x, back_y)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(back_x, back_y), new Point(right, bottom)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(left, top), new Point(back_x, top - front_y)],
                    segments
                )
            );
            pointArray.push(
                lineDivider(
                    [new Point(back_x, top - front_y), new Point(right, top)],
                    segments
                )
            );

            const open = Math.floor(PRNG.random(0, pointArray.length));
            pointArray[open].pop();

            const wrappedIndex = (open + pointArray.length) % pointArray.length;
            pointArray[wrappedIndex].pop();
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
                const yNoise1 = Perlin.noise(noiseI, noiseJ, seed) - 0.5;
                const yNoise2 = Perlin.noise(noiseI + 0.5, noiseJ, seed) - 0.5;

                currentPoint.y += yNoise1 * height;
                rotatedPoint.y += yNoise2 * height;

                const ln = lineDivider([currentPoint, rotatedPoint], 2);
                ln[0].x += PRNG.random(-0.25, 0.25) * height;

                this.add(
                    new Element(
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
