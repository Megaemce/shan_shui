import { generateTree08 } from "../trees/generateTree08";
import { generateTree07 } from "../trees/generateTree07";
import { generateTree06 } from "../trees/generateTree06";
import { generateTree05 } from "../trees/generateTree05";
import { generateTree04 } from "../trees/generateTree04";
import { generateTree02 } from "../trees/generateTree02";
import { generatePavilion } from "../architectures/generatePavilion";
import { Bound } from "../../classes/Bound";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateRock } from "./generateRock";

/**
 * Generate decorative elements for a flat mountain chunk based on its bounding box.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {Bound} bounding - The bounding box of the flat mountain.
 * @returns {SvgPolyline[]} An array of SVG polylines representing the decorative elements.
 */

export function generateFlatDecorations(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    bounding: Bound
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];

    const tt = prng.randomChoice([0, 0, 1, 2, 3, 4]);

    for (let j = 0; j < prng.random(0, 5); j++) {
        polylineArray.push(
            generateRock(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset +
                    (bounding.yMin + bounding.yMax) / 2 +
                    prng.normalizedRandom(-10, 10) +
                    10,
                prng.random(0, 100),
                prng.random(10, 30),
                2,
                prng.random(10, 30)
            )
        );
    }

    for (let j = 0; j < prng.randomChoice([0, 0, 1, 2]); j++) {
        const xr =
            xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax);
        const yr =
            yOffset +
            (bounding.yMin + bounding.yMax) / 2 +
            prng.normalizedRandom(-5, 5) +
            20;

        for (let k = 0; k < prng.random(2, 5); k++) {
            polylineArray.push(
                generateTree08(
                    prng,
                    xr +
                        Math.min(
                            Math.max(
                                prng.normalizedRandom(-30, 30),
                                bounding.xMin
                            ),
                            bounding.xMax
                        ),
                    yr,
                    prng.random(60, 100)
                )
            );
        }
    }

    if (tt === 0) {
        for (let j = 0; j < prng.random(0, 3); j++) {
            polylineArray.push(
                generateRock(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-5, 5) +
                        20,
                    prng.random(0, 100),
                    prng.random(40, 60),
                    5,
                    prng.random(50, 70)
                )
            );
        }
    }

    if (tt === 1) {
        const xMid = (bounding.xMin + bounding.xMax) / 2;
        const xMin = prng.random(bounding.xMin, xMid);
        const xMax = prng.random(xMid, bounding.xMax);

        for (let i = xMin; i < xMax; i += 30) {
            polylineArray.push(
                generateTree05(
                    prng,
                    xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                    yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                    prng.random(100, 300)
                )
            );
        }

        for (let j = 0; j < prng.random(0, 4); j++) {
            polylineArray.push(
                generateRock(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-5, 5) +
                        20,
                    prng.random(0, 100),
                    prng.random(40, 60),
                    5,
                    prng.random(50, 70)
                )
            );
        }
    } else if (tt === 2) {
        for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
            const xr = prng.normalizedRandom(bounding.xMin, bounding.xMax);
            const yr = (bounding.yMin + bounding.yMax) / 2;
            polylineArray.push(
                generateTree04(prng, xOffset + xr, yOffset + yr + 20)
            );

            for (let j = 0; j < prng.random(0, 2); j++) {
                polylineArray.push(
                    generateRock(
                        prng,
                        xOffset +
                            Math.max(
                                bounding.xMin,
                                Math.min(
                                    bounding.xMax,
                                    xr + prng.normalizedRandom(-50, 50)
                                )
                            ),
                        yOffset + yr + prng.normalizedRandom(-5, 5) + 20,
                        prng.random(100 * i * j),
                        prng.random(40, 60),
                        5,
                        prng.random(50, 70)
                    )
                );
            }
        }
    } else if (tt === 3) {
        for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
            polylineArray.push(
                generateTree06(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset + (bounding.yMin + bounding.yMax) / 2,
                    prng.random(60, 120)
                )
            );
        }
    } else if (tt === 4) {
        const xMid = (bounding.xMin + bounding.xMax) / 2;
        const xMin = prng.random(bounding.xMin, xMid);
        const xMax = prng.random(xMid, bounding.xMax);

        for (let i = xMin; i < xMax; i += 20) {
            polylineArray.push(
                generateTree07(
                    prng,
                    xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-1, 1) +
                        0,
                    prng.normalizedRandom(40, 80)
                )
            );
        }
    }

    for (let i = 0; i < prng.random(0, 50); i++) {
        polylineArray.push(
            generateTree02(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset + prng.normalizedRandom(bounding.yMin, bounding.yMax)
            )
        );
    }

    const ts = prng.randomChoice([0, 0, 0, 0, 1]);
    if (ts === 1 && tt !== 4) {
        polylineArray.push(
            generatePavilion(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                prng.random(),
                prng.normalizedRandom(80, 100),
                prng.normalizedRandom(160, 200),
                prng.random()
            )
        );
    }

    return polylineArray.flat();
}
