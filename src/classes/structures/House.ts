import Box from "./Box";
import Rail from "./Rail";
import Roof from "./Roof";
import Structure from "../Structure";
import { config } from "../../config";

const DECORATOR_HORIZONTAL_SUB_POINTS =
    config.structure.house.decorator.horizontalSubPoints;
const DECORATOR_VERTICAL_SUB_POINTS =
    config.structure.house.decorator.verticalSubPoints;
const DEFAULT_HAS_RAIL = config.structure.house.defaultHasRail;
const DEFAULT_ROTATION = config.structure.house.defaultRotatation;
const DEFAULT_STORIES = config.structure.house.defaultStories;
const DEFAULT_STROKE_WIDTH = config.structure.house.defaultStrokeWidth;
const DEFAULT_STYLE = config.structure.house.defaultStyle;
const HEIGHT = config.structure.house.height;
const PERSPECTIVE = config.structure.house.perspective;

export default class House extends Structure {
    constructor(
        xOffset: number,
        yOffset: number,
        strokeWidth: number = DEFAULT_STROKE_WIDTH,
        stories: number = DEFAULT_STORIES,
        rotation: number = DEFAULT_ROTATION,
        style: number = DEFAULT_STYLE,
        hasRail: boolean = DEFAULT_HAS_RAIL
    ) {
        super();

        let heightOffset = 0;

        for (let i = 0; i < stories; i++) {
            this.add(
                new Box(
                    xOffset,
                    yOffset - heightOffset,
                    HEIGHT,
                    strokeWidth * Math.pow(0.85, i),
                    rotation,
                    PERSPECTIVE,
                    false,
                    true,
                    1.5,
                    style,
                    DECORATOR_HORIZONTAL_SUB_POINTS[style],
                    DECORATOR_VERTICAL_SUB_POINTS[style]
                )
            );

            hasRail &&
                this.add(
                    new Rail(
                        xOffset,
                        yOffset - heightOffset,
                        i * 0.2,
                        false,
                        HEIGHT / 2,
                        strokeWidth * Math.pow(0.85, i) * 1.1,
                        PERSPECTIVE,
                        4,
                        true,
                        rotation,
                        0.5
                    )
                );

            this.add(
                new Roof(
                    xOffset,
                    yOffset - heightOffset - HEIGHT,
                    HEIGHT,
                    strokeWidth * Math.pow(0.9, i),
                    rotation,
                    1.5,
                    PERSPECTIVE
                )
            );

            heightOffset += HEIGHT * 1.5;
        }
    }
}
