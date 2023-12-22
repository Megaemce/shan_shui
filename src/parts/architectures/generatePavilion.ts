import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateMan } from "../man/generateMan";
import { generateHut } from "./generateHut";
import { generateBox } from "./generateBox";
import { generateRail } from "./generateRail";

/**
 * Generates Pavilion SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [seed=0] - The seed for randomization.
 * @param {number} [height=70] - The height of the Pavilion.
 * @param {number} [strokeWidth=180] - The stroke width of the Pavilion.
 * @param {number} [perturbation=5] - A parameter for Pavilion generation.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing Pavilion.
 */

export function generatePavilion(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = 70,
    strokeWidth: number = 180,
    perturbation: number = 5
): SvgPolyline[] {
    const p = prng.random(0.4, 0.6);
    const h0 = height * p;
    const h1 = height * (1 - p);

    const polylineArray: SvgPolyline[][] = [];

    polylineArray.push(
        generateHut(prng, xOffset, yOffset - height, h0, strokeWidth)
    );

    polylineArray.push(
        generateBox(
            prng,
            xOffset,
            yOffset,
            h1,
            (strokeWidth * 2) / 3,
            0.7,
            perturbation,
            true,
            false
        )
    );

    polylineArray.push(
        generateRail(
            prng,
            xOffset,
            yOffset,
            seed,
            true,
            10,
            strokeWidth,
            perturbation * 2,
            prng.random(3, 6),
            false
        )
    );

    const mcnt = prng.randomChoice([0, 1, 1, 2]);
    if (mcnt === 1) {
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(-strokeWidth / 3, strokeWidth / 3),
                yOffset,
                prng.randomChoice([true, false]),
                0.42
            )
        );
    } else if (mcnt === 2) {
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(-strokeWidth / 4, -strokeWidth / 5),
                yOffset,
                false,
                0.42
            )
        );
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(strokeWidth / 5, strokeWidth / 4),
                yOffset,
                true,
                0.42
            )
        );
    }

    polylineArray.push(
        generateRail(
            prng,
            xOffset,
            yOffset,
            seed,
            false,
            10,
            strokeWidth,
            perturbation * 2,
            prng.random(3, 6),
            true
        )
    );

    return polylineArray.flat();
}
