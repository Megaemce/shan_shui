import Box from "./Box";
import Structure from "../Structure";
import PagodaRoof from "./PagodaRoof";
import Point from "../Point";
import Rail from "./Rail";
import Decoration from "../elements/Decoration";
import { config } from "../../config";

const DECORATOR_HORIZONTAL_SUB_POINTS =
    config.structure.pagoda.decorator.horizontalSubPoints;
const DECORATOR_STYLE = config.structure.pagoda.decorator.style;
const DECORATOR_VERTICAL_SUB_POINTS =
    config.structure.pagoda.decorator.verticalSubPoints;
const DEFAULT_STORIES = config.structure.pagoda.defaultStories;
const DEFAULT_STROKE_WIDTH = config.structure.pagoda.defaultStrokeWidth;
const HEIGHT = config.structure.pagoda.height;
const PERIOD = config.structure.pagoda.period;
const ROTATION = config.structure.pagoda.rotation;

/**
 * Represents a series of arch structures with decreasing size.
 */
export default class Pagoda extends Structure {
    /**
     * @param {number} xOffset - The x-coordinate offset for the arches.
     * @param {number} yOffset - The y-coordinate offset for the arches.
     * @param {number} [strokeWidth=DEFAULT_STROKE_WIDTH] - The initial stroke width of the arches.
     * @param {number} [stories=DEFAULT_STORIES] - The number of arches to generate.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        strokeWidth: number = DEFAULT_STROKE_WIDTH,
        stories: number = DEFAULT_STORIES
    ) {
        super();

        let heightOffset = 0;

        const decorator = (
            upperLeftPoint: Point,
            upperRightPoint: Point,
            bottomLeftPoint: Point,
            bottomRightPoint: Point
        ) =>
            Decoration(
                DECORATOR_STYLE,
                upperLeftPoint,
                upperRightPoint,
                bottomLeftPoint,
                bottomRightPoint,
                DECORATOR_HORIZONTAL_SUB_POINTS,
                DECORATOR_VERTICAL_SUB_POINTS
            );

        for (let i = 0; i < stories; i++) {
            this.add(
                new Box(
                    xOffset,
                    yOffset - heightOffset,
                    HEIGHT,
                    strokeWidth * Math.pow(0.85, i),
                    ROTATION,
                    PERIOD / 2,
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
                    HEIGHT / 2,
                    strokeWidth * Math.pow(0.85, i) * 1.1,
                    PERIOD / 2,
                    5,
                    true,
                    ROTATION,
                    0.5
                )
            );
            this.add(
                new PagodaRoof(
                    xOffset,
                    yOffset - heightOffset - HEIGHT,
                    HEIGHT * 1.5,
                    strokeWidth * Math.pow(0.9, i),
                    1.5,
                    PERIOD
                )
            );
            heightOffset += HEIGHT * 1.5;
        }
    }
}
