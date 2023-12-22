import { Point } from "../../classes/Point";
import { PRNG } from "../../classes/PRNG";
import { ISvgElement } from "../../interfaces/ISvgElement";
import { generateBox } from "./generateBox";
import { generateDecoration } from "./generateDecoration";
import { generateRail } from "./generateRail";
import { generateRoof } from "./generateRoof";

/**
 * Generates House SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [strokeWidth=50] - The stroke width of the House.
 * @param {number} [stories=3] - The number of stories in the House.
 * @param {number} [rotation=0.3] - The rotation parameter for House.
 * @param {number} [style=1] - The style parameter for House.
 * @returns {ISvgElement[]} An array of SVG elements representing House.
 */

export function generateHouse(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    strokeWidth: number = 50,
    stories: number = 3,
    rotation: number = 0.3,
    style: number = 1
): ISvgElement[] {
    const height = 10;
    const perturbation = 5;
    const hasRail = false;
    const svgElements: ISvgElement[][] = [];
    const decorator = (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) =>
        generateDecoration(
            style,
            upperLeftPoint,
            upperRightPoint,
            bottomLeftPoint,
            bottomRightPoint,
            [[], [1, 5], [1, 5], [1, 4]][style],
            [[], [1, 2], [1, 2], [1, 3]][style]
        );

    let hightOffset = 0;

    for (let i = 0; i < stories; i++) {
        svgElements.push(
            generateBox(
                prng,
                xOffset,
                yOffset - hightOffset,
                height,
                strokeWidth * Math.pow(0.85, i),
                rotation,
                perturbation,
                false,
                true,
                1.5,
                decorator
            )
        );

        svgElements.push(
            hasRail
                ? generateRail(
                      prng,
                      xOffset,
                      yOffset - hightOffset,
                      i * 0.2,
                      false,
                      height / 2,
                      strokeWidth * Math.pow(0.85, i) * 1.1,
                      perturbation,
                      4,
                      true,
                      rotation,
                      0.5
                  )
                : []
        );

        const text: string =
            stories === 1 && prng.random() < 1 / 3 ? "Pizza Hut" : "";
        svgElements.push(
            generateRoof(
                prng,
                xOffset,
                yOffset - hightOffset - height,
                height,
                strokeWidth * Math.pow(0.9, i),
                rotation,
                1.5,
                perturbation,
                text
            )
        );

        hightOffset += height * 1.5;
    }

    return svgElements.flat();
}
