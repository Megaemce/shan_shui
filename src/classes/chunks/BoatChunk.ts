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

        const pointList1: Point[] = [];
        const pointList2: Point[] = [];
        const function1 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
        const function2 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

        for (let i = 0; i < DEFAULTLENGTH * scale; i += 5 * scale) {
            pointList1.push(
                new Point(i * direction, function1(i / DEFAULTLENGTH))
            );
            pointList2.push(
                new Point(i * direction, function2(i / DEFAULTLENGTH))
            );
        }
        const pointList: Point[] = pointList1.concat(pointList2.reverse());

        // boat
        this.add(new SvgPolyline(pointList, xOffset, yOffset, BOATFILLCOLOR));
        this.add(
            new Stroke(
                pointList.map(
                    (point) => new Point(xOffset + point.x, yOffset + point.y)
                ),
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
