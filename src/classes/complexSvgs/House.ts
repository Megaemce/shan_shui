import Box from "./Box";
import ComplexSvg from "../ComplexSvg";
import Point from "../Point";
import Rail from "./Rail";
import Roof from "./Roof";
import generateDecoration from "../svgPolylines/generateDecoration";

export default class House extends ComplexSvg {
    constructor(
        xOffset: number,
        yOffset: number,
        strokeWidth: number = 50,
        stories: number = 3,
        rotation: number = 0.3,
        style: number = 1
    ) {
        super();

        const height = 10;
        const perspective = 5;
        const hasRail = false;
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

        let heightOffset = 0;

        for (let i = 0; i < stories; i++) {
            this.add(
                new Box(
                    xOffset,
                    yOffset - heightOffset,
                    height,
                    strokeWidth * Math.pow(0.85, i),
                    rotation,
                    perspective,
                    false,
                    true,
                    1.5,
                    decorator
                )
            );

            hasRail &&
                this.add(
                    new Rail(
                        xOffset,
                        yOffset - heightOffset,
                        i * 0.2,
                        false,
                        height / 2,
                        strokeWidth * Math.pow(0.85, i) * 1.1,
                        perspective,
                        4,
                        true,
                        rotation,
                        0.5
                    )
                );

            this.add(
                new Roof(
                    xOffset,
                    yOffset - heightOffset - height,
                    height,
                    strokeWidth * Math.pow(0.9, i),
                    rotation,
                    1.5,
                    perspective
                )
            );

            heightOffset += height * 1.5;
        }
    }
}
