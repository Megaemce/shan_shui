import BottomMountainDecoration from "../structures/BottomMountainDecoration";
import Element from "../Element";
import Layer from "../Layer";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import Texture from "../structures/Texture";
import { calculateBoundingBox } from "../../utils/polytools";
import { config } from "../../config";
import { lineDivider } from "../../utils/polytools";

const BACKGROUND_FILL_COLOR = config.layers.bottomMountain.background.fillColor;
const BACKGROUND_STROKE_COLOR = config.layers.bottomMountain.background.color;
const DEFAULT_FLATNESS = config.layers.bottomMountain.defaultFlatness;
const DEFAULT_SEED = config.layers.bottomMountain.defaultSeed;
const OUTLINE_FILL_COLOR = config.layers.bottomMountain.outline.fillColor;
const OUTLINE_STROKE_COLOR = config.layers.bottomMountain.outline.color;
const OUTLINE_STROKE_NOISE = config.layers.bottomMountain.outline.strokeNoise;
const OUTLINE_STROKE_WIDTH = config.layers.bottomMountain.outline.strokeWidth;
const POLYLINE_FILL_COLOR = config.layers.bottomMountain.polyline.fillColor;
const POLYLINE_STROKE_COLOR = config.layers.bottomMountain.polyline.color;
const POLYLINE_STROKE_WIDTH = config.layers.bottomMountain.polyline.strokeWidth;
const STROKE_COLOR = config.layers.bottomMountain.stroke.color;
const STROKE_FILL_COLOR = config.layers.bottomMountain.stroke.fillColor;
const STROKE_WIDTH = config.layers.bottomMountain.stroke.strokeWidth;
const TEXTURE_SIZE = config.layers.bottomMountain.texture.size;
const TEXTURE_WIDTH = config.layers.bottomMountain.texture.width;

/**
 * Represents a flat mountain chunk with optional vegetation and textures.
 *
 * @extends Layer
 */
export default class BottomMountainLayer extends Layer {
    /**
     * Constructor for generating a flat mountain chunk with optional vegetation and textures.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=DEFAULT_SEED] - The seed value for noise functions.
     * @param {number} [width] - The width of the mountain.
     * @param {number} [height] - The height of the mountain.
     * @param {number} [flatness=DEFAULT_FLATNESS] - Parameter controlling the flatness of the mountain.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULT_SEED,
        width: number,
        height: number,
        flatness: number = DEFAULT_FLATNESS
    ) {
        super("bottomMountain", xOffset, yOffset);

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
            new Element(
                pointArray[0].concat([new Point(0, elementNumber * 4)]),
                xOffset,
                yOffset,
                BACKGROUND_FILL_COLOR,
                BACKGROUND_STROKE_COLOR
            )
        );

        // OUTLINE_
        this.add(
            new Stroke(
                pointArray[0].map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                OUTLINE_FILL_COLOR,
                OUTLINE_STROKE_COLOR,
                OUTLINE_STROKE_WIDTH,
                OUTLINE_STROKE_NOISE
            )
        );

        // TEXTURE_
        this.add(
            new Texture(
                pointArray,
                xOffset,
                yOffset,
                TEXTURE_SIZE,
                TEXTURE_WIDTH,
                PRNG.randomChoice([1, 2, 3]),
                () => {
                    if (PRNG.random() > 0.5) {
                        return 0.1 + 0.4 * PRNG.random();
                    } else {
                        return 0.9 - 0.4 * PRNG.random();
                    }
                }
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

        // Top platform
        this.add(
            new Element(
                grlist,
                xOffset,
                yOffset,
                POLYLINE_FILL_COLOR,
                POLYLINE_STROKE_COLOR,
                POLYLINE_STROKE_WIDTH
            )
        );

        // Top platform stroke
        this.add(
            new Stroke(
                grlist.map((p) => new Point(p.x + xOffset, p.y + yOffset)),
                STROKE_FILL_COLOR,
                STROKE_COLOR,
                STROKE_WIDTH
            )
        );

        this.add(
            new BottomMountainDecoration(
                xOffset,
                yOffset,
                calculateBoundingBox(grlist)
            )
        );
    }
}
