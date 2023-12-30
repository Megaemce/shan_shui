import Chunk from "../Chunk";
import Man from "../complexSvgs/Man";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import { config } from "../../config";

const BOATFILLCOLOR = config.chunks.boat.boat.fillColor;
const DEFAULTFLIP = config.chunks.boat.defaultFlip;
const DEFAULTLENGTH = config.chunks.boat.defaultLength;
const DEFAULTSCALE = config.chunks.boat.defaultScale;
const MANHASSTICK = config.chunks.boat.man.hasStick;
const MANHATNUMBER = config.chunks.boat.man.hatNumber;
const STROKECOLOR = config.chunks.boat.stroke.color;
const STROKEFILLCOLOR = config.chunks.boat.stroke.fillColor;
const STROKENOISE = config.chunks.boat.stroke.strokeNoise;
const STROKESTROKEWIDTH = config.chunks.boat.stroke.strokeWidth;
const STROKEWIDTH = config.chunks.boat.stroke.width;
/**
 * Represents a boat chunk with different scale and flip.
 *
 * @extends Chunk
 */
export default class BoatChunk extends Chunk {
    /**
     * Constructor for the Boat class.
     * @param {number} xOffset - The x-coordinate offset for the boat.
     * @param {number} yOffset - The y-coordinate offset for the boat.
     * @param {number} [scale=DEFAULTSCALE] - The scale of the boat.
     * @param {boolean} [flip=DEFAULTFLIP] - Whether to flip the boat horizontally.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        scale: number = DEFAULTSCALE,
        flip: boolean = DEFAULTFLIP
    ) {
        super("boat", xOffset, yOffset);

        const direction = flip ? -1 : 1;
        const pointNum = DEFAULTLENGTH / 5;
        const pointArray = new Array<Point>(2 * pointNum);
        const lastIndex = 2 * pointNum - 1;
        const function1 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
        const function2 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

        for (let i = 0; i < pointNum; i++) {
            const hop = i * 5 * scale;
            const xPoint = hop * direction + xOffset;
            const yPoint = hop / DEFAULTLENGTH;

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
        this.add(new SvgPolyline(pointArray, 0, 0, BOATFILLCOLOR));
        this.add(
            new Stroke(
                pointArray,
                STROKEFILLCOLOR,
                STROKECOLOR,
                STROKEWIDTH,
                STROKENOISE,
                STROKESTROKEWIDTH,
                (x) => Math.sin(x * Math.PI * 2)
            )
        );
    }
}
