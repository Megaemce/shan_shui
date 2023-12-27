import Box from "./Box";
import ComplexSvg from "../ComplexSvg";
import PagodaRoof from "./PagodaRoof";
import Point from "../Point";
import Rail from "./Rail";
import generateDecoration from "../svgPolylines/generateDecoration";

/**
 * Represents a series of arch structures with decreasing size.
 */
export default class Pagoda extends ComplexSvg {
    /**
     * @param {number} xOffset - The x-coordinate offset for the arches.
     * @param {number} yOffset - The y-coordinate offset for the arches.
     * @param {number} [strokeWidth=50] - The initial stroke width of the arches.
     * @param {number} [stories=7] - The number of arches to generate.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        strokeWidth: number = 50,
        stories: number = 7
    ) {
        super();

        const height = 10,
            rotation = 0.7,
            period = 5;

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
            this.add(
                new Box(
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
            this.add(
                new Rail(
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
            this.add(
                new PagodaRoof(
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
    }
}
