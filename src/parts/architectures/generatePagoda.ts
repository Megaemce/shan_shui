import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { generateBox } from "./generateBox";
import { generateDecoration } from "./generateDecoration";
import { generateRail } from "./generateRail";
import { generatePagodaRoof } from "./generatePagodaRoof";

/**
 * Generates a series of arch structures with decreasing size.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the arches.
 * @param yOffset - The y-coordinate offset for the arches.
 * @param strokeWidth - The initial stroke width of the arches.
 * @param stories - The number of arches to generate.
 * @returns An array of SvgPolyline representing the arch structures.
 */

export function generatePagoda(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    strokeWidth: number = 50,
    stories: number = 7
): SvgPolyline[] {
    const height = 10,
        rotation = 0.7,
        period = 5;

    const polylineArray: SvgPolyline[][] = [];

    let heightOffset = 0;

    const decorator = (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) =>
        generateDecoration(
            1,
            upperLeftPoint,
            upperRightPoint,
            bottomLeftPoint,
            bottomRightPoint,
            [1, 4],
            [1, 2]
        );

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
                false,
                true,
                1.5,
                decorator
            )
        );
        polylineArray.push(
            generateRail(
                prng,
                xOffset,
                yOffset - heightOffset,
                i * 0.2,
                false,
                height / 2,
                strokeWidth * Math.pow(0.85, i) * 1.1,
                period / 2,
                5,
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
                height * 1.5,
                strokeWidth * Math.pow(0.9, i),
                1.5,
                period
            )
        );
        heightOffset += height * 1.5;
    }

    return polylineArray.flat();
}
