import Point from "../Point";
import PRNG from "../PRNG";
import ComplexSvg from "../ComplexSvg";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import Perlin from "../Perlin";

/**
 * Represents a mountain foot generated using procedural generation.
 */
export default class MountainFoot extends ComplexSvg {
    /**
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {Point[][]} pointArray - An array of arrays representing the points.
     * @param {number} xOffset - X-coordinate offset for the mountain foot.
     * @param {number} yOffset - Y-coordinate offset for the mountain foot.
     */
    constructor(
        prng: PRNG,
        pointArray: Point[][],
        xOffset: number = 0,
        yOffset: number = 0
    ) {
        super();

        const footArray: Point[][] = [];
        const span = 10;
        let ni = 0;

        for (let i = 0; i < pointArray.length - 2; i += 1) {
            if (i !== ni) continue;

            ni = Math.min(
                ni + prng.randomChoice([1, 2]),
                pointArray.length - 1
            );

            footArray.push([]);
            footArray.push([]);

            for (let j = 0; j < Math.min(pointArray[i].length / 8, 10); j++) {
                footArray[footArray.length - 2].push(
                    new Point(
                        pointArray[i][j].x +
                            Perlin.noise(prng, j * 0.1, i) * 10,
                        pointArray[i][j].y
                    )
                );
                footArray[footArray.length - 1].push(
                    new Point(
                        pointArray[i][pointArray[i].length - 1 - j].x -
                            Perlin.noise(prng, j * 0.1, i) * 10,
                        pointArray[i][pointArray[i].length - 1 - j].y
                    )
                );
            }

            footArray[footArray.length - 2].reverse();
            footArray[footArray.length - 1].reverse();

            for (let j = 0; j < span; j++) {
                const p = j / span;
                const x1 =
                    pointArray[i][0].x * (1 - p) + pointArray[ni][0].x * p;
                let y1 = pointArray[i][0].y * (1 - p) + pointArray[ni][0].y * p;

                const x2 =
                    pointArray[i][pointArray[i].length - 1].x * (1 - p) +
                    pointArray[ni][pointArray[i].length - 1].x * p;
                let y2 =
                    pointArray[i][pointArray[i].length - 1].y * (1 - p) +
                    pointArray[ni][pointArray[i].length - 1].y * p;

                const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
                y1 += vib * 5 + Perlin.noise(prng, xOffset * 0.05, i) * 5;
                y2 += vib * 5 + Perlin.noise(prng, xOffset * 0.05, i) * 5;

                footArray[footArray.length - 2].push(new Point(x1, y1));
                footArray[footArray.length - 1].push(new Point(x2, y2));
            }
        }

        for (let i = 0; i < footArray.length; i++) {
            this.add(
                new SvgPolyline(footArray[i], xOffset, yOffset, "white", "none")
            );
        }

        for (let j = 0; j < footArray.length; j++) {
            const color = `rgba(100,100,100,${prng
                .random(0.1, 0.2)
                .toFixed(3)})`;
            this.add(
                new Stroke(
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
    }
}
