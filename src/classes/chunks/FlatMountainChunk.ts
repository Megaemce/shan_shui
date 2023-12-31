import Chunk from "../Chunk";
import FlatDecoration from "../complexSvgs/FlatDecoration";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import Texture from "../complexSvgs/Texture";
import { calculateBoundingBox } from "../../utils/polytools";
import { config } from "../../config";
import { lineDivider } from "../../utils/polytools";

const BACKGROUNDFILLCOLOR = config.chunks.flatMountain.background.fillColor;
const BACKGROUNDSTROKECOLOR = config.chunks.flatMountain.background.color;
const DEFAULTFLATNESS = config.chunks.flatMountain.defaultFlatness;
const DEFAULTHEIGHTMAX = config.chunks.flatMountain.defaultHeight.max;
const DEFAULTHEIGHTMIN = config.chunks.flatMountain.defaultHeight.min;
const DEFAULTSEED = config.chunks.flatMountain.defaultSeed;
const DEFAULTWIDTHMAX = config.chunks.flatMountain.defaultWidth.max;
const DEFAULTWIDTHMIN = config.chunks.flatMountain.defaultWidth.min;
const OUTLINEFILLCOLOR = config.chunks.flatMountain.outline.fillColor;
const OUTLINESTROKECOLOR = config.chunks.flatMountain.outline.color;
const OUTLINESTROKENOISE = config.chunks.flatMountain.outline.strokeNoise;
const OUTLINESTROKEWIDTH = config.chunks.flatMountain.outline.strokeWidth;
const POLYLINEFILLCOLOR = config.chunks.flatMountain.polyline.fillColor;
const POLYLINESTROKECOLOR = config.chunks.flatMountain.polyline.color;
const POLYLINESTROKEWIDTH = config.chunks.flatMountain.polyline.strokeWidth;
const STROKECOLOR = config.chunks.flatMountain.stroke.color;
const STROKEFILLCOLOR = config.chunks.flatMountain.stroke.fillColor;
const STROKEWIDTH = config.chunks.flatMountain.stroke.strokeWidth;
const TEXTURESHADOW = config.chunks.flatMountain.texture.shadow;
const TEXTURESIZE = config.chunks.flatMountain.texture.size;

/**
 * Represents a flat mountain chunk with optional vegetation and textures.
 *
 * @extends Chunk
 */
export default class FlatMountainChunk extends Chunk {
    /**
     * Constructor for generating a flat mountain chunk with optional vegetation and textures.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=DEFAULTSEED] - The seed value for noise functions.
     * @param {number} [height =PRNG.random(DEFAULTHEIGHTMIN, DEFAULTHEIGHTMAX)] - The height of the mountain.
     * @param {number} [width =PRNG.random(DEFAULTWIDTHMIN, DEFAULTWIDTHMAX)] - The width of the mountain.
     * @param {number} [flatness=DEFAULTFLATNESS] - Parameter controlling the flatness of the mountain.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULTSEED,
        height: number = PRNG.random(DEFAULTHEIGHTMIN, DEFAULTHEIGHTMAX),
        width: number = PRNG.random(DEFAULTWIDTHMIN, DEFAULTWIDTHMAX),
        flatness: number = DEFAULTFLATNESS
    ) {
        super("flatmount", xOffset, yOffset);

        const elementNumber = 5;
        const elementDetails = 50;
        const pointArray: Point[][] = [];
        const flat: Point[][] = [];

        let heightOffset = 0;

        for (let j = 0; j < elementNumber; j++) {
            heightOffset += PRNG.random(0, yOffset / 100);
            pointArray.push([]);
            flat.push([]);

            for (let i = 0; i < elementDetails; i++) {
                const x = (i / elementDetails - 0.5) * Math.PI;
                const y =
                    (Math.cos(x * 2) + 1) * Perlin.noise(x + 10, j * 0.1, seed);
                const p = 1 - (j / elementNumber) * 0.6;
                const newX = (x / Math.PI) * width * p;
                let newY = -y * height * p + heightOffset;
                const h = 100;

                if (newY < -h * flatness + heightOffset) {
                    newY = -h * flatness + heightOffset;
                    if (flat[flat.length - 1].length % 2 === 0) {
                        flat[flat.length - 1].push(new Point(newX, newY));
                    }
                } else {
                    if (flat[flat.length - 1].length % 2 === 1) {
                        flat[flat.length - 1].push(
                            pointArray[pointArray.length - 1][
                                pointArray[pointArray.length - 1].length - 1
                            ]
                        );
                    }
                }

                pointArray[pointArray.length - 1].push(new Point(newX, newY));
            }
        }

        // WHITE BG
        this.add(
            new SvgPolyline(
                pointArray[0].concat([new Point(0, elementNumber * 4)]),
                xOffset,
                yOffset,
                BACKGROUNDFILLCOLOR,
                BACKGROUNDSTROKECOLOR
            )
        );

        // OUTLINE
        this.add(
            new Stroke(
                pointArray[0].map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                OUTLINEFILLCOLOR,
                OUTLINESTROKECOLOR,
                OUTLINESTROKEWIDTH,
                OUTLINESTROKENOISE
            )
        );

        // TEXTURE
        this.add(
            new Texture(
                pointArray,
                xOffset,
                yOffset,
                TEXTURESIZE,
                TEXTURESHADOW,
                () => 0.5 + PRNG.randomSign() * PRNG.random(0, 0.4)
            )
        );

        const _grlist1: Point[] = [];
        const _grlist2: Point[] = [];

        for (let i = 0; i < flat.length; i += 2) {
            if (flat[i].length >= 2) {
                _grlist1.push(flat[i][0]);
                _grlist2.push(flat[i][flat[i].length - 1]);
            }
        }

        if (_grlist1.length === 0) {
            return;
        }

        const _wb = [_grlist1[0].x, _grlist2[0].x];

        for (let i = 0; i < 3; i++) {
            const p = 0.8 - i * 0.2;
            _grlist1.unshift(new Point(_wb[0] * p, _grlist1[0].y - 5));
            _grlist2.unshift(new Point(_wb[1] * p, _grlist2[0].y - 5));
        }

        const wb = [
            _grlist1[_grlist1.length - 1].x,
            _grlist2[_grlist2.length - 1].x,
        ];

        for (let i = 0; i < 3; i++) {
            const p = 0.6 - i * i * 0.1;
            _grlist1.push(
                new Point(wb[0] * p, _grlist1[_grlist1.length - 1].y + 1)
            );
            _grlist2.push(
                new Point(wb[1] * p, _grlist2[_grlist2.length - 1].y + 1)
            );
        }

        const d = 5;
        const grlist1 = lineDivider(_grlist1, d);
        const grlist2 = lineDivider(_grlist2, d);

        const grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));

        grlist.forEach((point, i) => {
            const v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
            point.x *= 1 - v + Perlin.noise(point.y * 0.5) * v;
        });

        this.add(
            new SvgPolyline(
                grlist,
                xOffset,
                yOffset,
                POLYLINEFILLCOLOR,
                POLYLINESTROKECOLOR,
                POLYLINESTROKEWIDTH
            )
        );
        this.add(
            new Stroke(
                grlist.map((p) => new Point(p.x + xOffset, p.y + yOffset)),
                STROKEFILLCOLOR,
                STROKECOLOR,
                STROKEWIDTH
            )
        );

        this.add(
            new FlatDecoration(xOffset, yOffset, calculateBoundingBox(grlist))
        );
    }
}
