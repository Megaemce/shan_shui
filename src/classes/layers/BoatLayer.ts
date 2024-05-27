import Element from "../Element";
import Layer from "../Layer";
import Man from "../structures/Man";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import { config } from "../../config";

const DEFAULT_FLIP = config.layers.boat.defaultFlip;
const FILL_COLOR = config.layers.boat.boat.fillColor;
const MAN_HASSTICK = config.layers.boat.man.hasStick;
const MAN_HATNUMBER = config.layers.boat.man.hatNumber;
const STROKE_COLOR = config.layers.boat.stroke.color;
const STROKE_FILL_COLOR = config.layers.boat.stroke.fillColor;
const STROKE_NOISE = config.layers.boat.stroke.strokeNoise;
const STROKE_STROKE_WIDTH = config.layers.boat.stroke.strokeWidth;
const STROKE_WIDTH = config.layers.boat.stroke.width;
/**
 * Represents a boat layer with different scale and flip.
 *
 * @extends Layer
 */
export default class BoatLayer extends Layer {
    /**
     * Constructor for the Boat class.
     * @param {number} xOffset - The x-coordinate offset for the boat.
     * @param {number} yOffset - The y-coordinate offset for the boat.
     * @param {number} width - The width of the boat.
     * @param {number} [scale] - The scale of the boat.
     * @param {boolean} [flip=DEFAULT_FLIP] - Whether to flip the boat horizontally.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        width: number,
        scale: number,
        flip: boolean = DEFAULT_FLIP
    ) {
        super("boat", xOffset, yOffset);

        const direction = flip ? -1 : 1;
        const pointNum = width / 5;
        const pointArray = new Array<Point>(2 * pointNum);
        const lastIndex = 2 * pointNum - 1;
        const function1 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
        const function2 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

        for (let i = 0; i < pointNum; i++) {
            const offset = i * 5 * scale;
            const x = offset * direction + xOffset;
            const y = offset / width;

            // upper part of the boat
            pointArray[i] = new Point(x, function1(y) + yOffset);
            // lower part of the boat
            pointArray[lastIndex - i] = new Point(x, function2(y) + yOffset);
        }

        // Man on the boat
        this.add(
            new Man(
                xOffset + 20 * scale * direction,
                yOffset,
                !flip,
                0.5 * scale,
                [0, 30, 20, 30, 10, 30, 30, 30, 30],
                MAN_HASSTICK,
                MAN_HATNUMBER
            )
        );
        // Boat
        this.add(new Element(pointArray, 0, 0, FILL_COLOR));
        this.add(
            new Stroke(
                pointArray,
                STROKE_FILL_COLOR,
                STROKE_COLOR,
                STROKE_WIDTH,
                STROKE_NOISE,
                STROKE_STROKE_WIDTH,
                (x) => Math.sin(x * Math.PI * 2)
            )
        );
    }
}
