import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBox } from "./generateBox";
import { generateRail } from "./generateRail";
import { generatePagodaRoof } from "./generatePagodaRoof";

/**
 * Generates a series of arch structures with increasing size.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the arches.
 * @param yOffset - The y-coordinate offset for the arches.
 * @param stories - The number of arches to generate.
 * @returns An array of SvgPolyline representing the arch structures.
 */

export function generateTower(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    stories: number = 2
): SvgPolyline[] {
    const height = 15,
        strokeWidth = 30,
        rotation = 0.7,
        period = 5;

    const polylineArray: SvgPolyline[][] = [];

    let heightOffset = 0;

    for (let i = 0; i < stories; i++) {
        polylineArray.push(
            generateBox(
                prng,
                xOffset,
                yOffset - heightOffset,
                height,
                strokeWidth * Math.pow(0.85, i),
                rotation,
                period / 2,
                true,
                true,
                1.5
            )
        );
        polylineArray.push(
            generateRail(
                prng,
                xOffset,
                yOffset - heightOffset,
                i * 0.2,
                true,
                height / 3,
                strokeWidth * Math.pow(0.85, i) * 1.2,
                period / 2,
                3,
                true,
                rotation,
                0.5
            )
        );
        polylineArray.push(
            generatePagodaRoof(
                prng,
                xOffset,
                yOffset - heightOffset - height,
                height * 1,
                strokeWidth * Math.pow(0.9, i),
                1.5,
                period
            )
        );
        heightOffset += height * 1.2;
    }

    return polylineArray.flat();
}
