import Layer from "../Layer";
import Man from "../structures/Man";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Element from "../Element";
import { config } from "../../config";

const BOATFILL_COLOR = config.chunks.boat.boat.fillColor;
const DEFAULT_FLIP = config.chunks.boat.defaultFlip;
const DEFAULT_LENGTH = config.chunks.boat.defaultLength;
const DEFAULT_SCALE = config.chunks.boat.defaultScale;
const MANHASSTICK = config.chunks.boat.man.hasStick;
const MANHATNUMBER = config.chunks.boat.man.hatNumber;
const STROKE_COLOR = config.chunks.boat.stroke.color;
const STROKE_FILL_COLOR = config.chunks.boat.stroke.fillColor;
const STROKE_NOISE = config.chunks.boat.stroke.strokeNoise;
const STROKE_STROKE_WIDTH = config.chunks.boat.stroke.strokeWidth;
const STROKE_WIDTH = config.chunks.boat.stroke.width;
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
     * @param {number} [scale=DEFAULT_SCALE] - The scale of the boat.
     * @param {boolean} [flip=DEFAULT_FLIP] - Whether to flip the boat horizontally.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        scale: number = DEFAULT_SCALE,
        flip: boolean = DEFAULT_FLIP
    ) {
        super("boat", xOffset, yOffset);

        const direction = flip ? -1 : 1;
        const pointNum = DEFAULT_LENGTH / 5;
        const pointArray = new Array<Point>(2 * pointNum);
        const lastIndex = 2 * pointNum - 1;
        const function1 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
        const function2 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

        for (let i = 0; i < pointNum; i++) {
            const hop = i * 5 * scale;
            const xPoint = hop * direction + xOffset;
            const yPoint = hop / DEFAULT_LENGTH;

            pointArray[i] = new Point(xPoint, function1(yPoint) + yOffset);
            pointArray[lastIndex - i] = new Point(
                xPoint,
                function2(yPoint) + yOffset
            );
        }

        // Man on the boat
        this.add(
            new Man(
                xOffset + 20 * scale * direction,
                yOffset,
                !flip,
                0.5 * scale,
                [0, 30, 20, 30, 10, 30, 30, 30, 30],
                MANHASSTICK,
                MANHATNUMBER
            )
        );
        // boat
        this.add(new Element(pointArray, 0, 0, BOATFILL_COLOR));
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
