import Element from "../Element";
import House from "../structures/House";
import Layer from "../Layer";
import MiddleMountainFoot from "../structures/MiddleMountainFoot";
import MiddleMountainWater from "../structures/MiddleMountainWater";
import PRNG from "../PRNG";
import Pagoda from "../structures/Pagoda";
import Perlin from "../Perlin";
import Point from "../Point";
import Rock from "../structures/Rock";
import Stroke from "../elements/Stroke";
import Structure from "../Structure";
import Texture from "../structures/Texture";
import TransmissionTower from "../structures/TransmissionTower";
import Tree01 from "../structures/Tree01";
import Tree02 from "../structures/Tree02";
import Tree03 from "../structures/Tree03";
import generateTower from "../structures/Tower";
import { config } from "../../config";
import { distance } from "../../utils/polytools";
import { generateVegetate } from "../../utils/generateVegetate";

const BACKGROUND_FILL_COLOR = config.layers.middleMountain.background.fillColor;
const BACKGROUND_STROKE_COLOR =
    config.layers.middleMountain.background.strokeColor;
const BOTTOM_COLORNOALFA = config.layers.middleMountain.bottom.colorNoAlfa;
const DEFAULT_HEIGHT_MAX = config.layers.middleMountain.defaultHeight.max;
const DEFAULT_HEIGHT_MIN = config.layers.middleMountain.defaultHeight.min;
const DEFAULT_MIDDLE_VEGETATION =
    config.layers.middleMountain.defaultMiddleVegetation;
const DEFAULT_SEED = config.layers.middleMountain.defaultSeed;
const DEFAULT_WIDTH_MAX = config.layers.middleMountain.defaultWidth.max;
const DEFAULT_WIDTH_MIN = config.layers.middleMountain.defaultWidth.min;
const MIDDLE_COLORNOALFA = config.layers.middleMountain.middle.colorNoAlfa;
const OUTLINE_COLOR = config.layers.middleMountain.outline.color;
const OUTLINE_FILL_COLOR = config.layers.middleMountain.outline.fillColor;
const OUTLINE_STROKE_NOISE = config.layers.middleMountain.outline.strokeNoise;
const OUTLINE_STROKE_WIDTH = config.layers.middleMountain.outline.strokeWidth;
const RIM_CLUSTERS = config.layers.middleMountain.rim.clusters;
const RIM_COLORNOALFA = config.layers.middleMountain.rim.colorNoAlfa;
const TEXTURE_SIZE = config.layers.middleMountain.texture.size;
const TOP_COLORNOALFA = config.layers.middleMountain.top.colorNoAlfa;

/**
 * Represents a mountainous landscape with various elements.
 *
 * @extends Layer
 */
export default class MiddleMountainLayer extends Layer {
    /**
     * Constructor for generating a mountainous landscape with various elements.
     *
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=DEFAULT_SEED] - The seed for noise functions.
     * @param {number} [width=PRNG.random(DEFAULT_WIDTH_MIN, DEFAULT_WIDTH_MAX)] - The width of the mountain.
     * @param {number} [height=PRNG.random(DEFAULT_HEIGHT_MIN, DEFAULT_HEIGHT_MAX)] - The height of the mountain.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULT_SEED,
        width: number = PRNG.random(DEFAULT_WIDTH_MIN, DEFAULT_WIDTH_MAX),
        height: number = PRNG.random(DEFAULT_HEIGHT_MIN, DEFAULT_HEIGHT_MAX)
    ) {
        super("middleMountain", xOffset, yOffset);

        // number of elements, and details of each element
        const [elementNumber, elementDetails] = [10, 50];
        const elementArray = new Array<Point[]>(elementNumber);

        let heightOffset = 0;

        for (let i = 0; i < elementNumber; i++) {
            const p = 1 - i / elementNumber;

            heightOffset += PRNG.random(0, yOffset / 100);
            elementArray[i] = new Array<Point>(elementDetails);

            for (let j = 0; j < elementDetails; j++) {
                const x = (j / elementDetails - 0.5) * Math.PI;
                const y = Math.cos(x) * Perlin.noise(x + 10, i * 0.15, seed);

                elementArray[i][j] = new Point(
                    (x / Math.PI) * width * p,
                    -y * height * p + heightOffset
                );
            }
        }

        // Water
        this.add(new MiddleMountainWater(xOffset, yOffset));

        // RIM_

        generateVegetate(
            elementArray,
            function (x, y) {
                const noise =
                    Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    x + xOffset,
                    y + yOffset - 5,
                    RIM_COLORNOALFA + noise.toFixed(3) + ")",
                    RIM_CLUSTERS
                );
            },
            function (i, j) {
                const noise = Perlin.noise(j * 0.1, seed);
                return (
                    i === 0 &&
                    noise * noise * noise < 0.1 &&
                    Math.abs(elementArray[i][j].y) / height > 0.2
                );
            },
            () => true,
            this
        );

        // WHITE BG
        this.add(
            new Element(
                elementArray[0].concat([new Point(0, elementNumber * 4)]),
                xOffset,
                yOffset,
                BACKGROUND_FILL_COLOR,
                BACKGROUND_STROKE_COLOR
            )
        );

        // OUTLINE_
        this.add(
            new Stroke(
                elementArray[0].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                OUTLINE_FILL_COLOR,
                OUTLINE_COLOR,
                OUTLINE_STROKE_WIDTH,
                OUTLINE_STROKE_NOISE
            )
        );

        this.add(new MiddleMountainFoot(elementArray, xOffset, yOffset));

        this.add(
            new Texture(
                elementArray,
                xOffset,
                yOffset,
                TEXTURE_SIZE,
                PRNG.randomChoice([2, 1, 3])
            )
        );

        // TOP_
        generateVegetate(
            elementArray,
            function (x, y) {
                const noise =
                    Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    x + xOffset,
                    y + yOffset,
                    TOP_COLORNOALFA + noise.toFixed(3) + ")"
                );
            },
            function (i, j) {
                const noise = Perlin.noise(i * 0.1, j * 0.1, seed + 2);
                return (
                    Math.pow(noise, 3) < 0.1 &&
                    Math.abs(elementArray[i][j].y) / height > 0.5
                );
            },
            () => true,
            this
        );

        if (DEFAULT_MIDDLE_VEGETATION) {
            // MIDDLE_

            generateVegetate(
                elementArray,
                function (x, y) {
                    const treeHeight =
                        ((height + y) / height) * 70 * PRNG.random(0.3, 1);
                    const noise =
                        Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return new Tree01(
                        x + xOffset,
                        y + yOffset,
                        treeHeight,
                        PRNG.random(1, 4),
                        MIDDLE_COLORNOALFA + noise.toFixed(3) + ")"
                    );
                },
                function (i, j): boolean {
                    const noise = Perlin.noise(i * 0.2, j * 0.05, seed);
                    return (
                        j % 2 !== 0 &&
                        Math.pow(noise, 4) < 0.012 &&
                        Math.abs(elementArray[i][j].y) / height < 0.3
                    );
                },
                function (vegList, i) {
                    const count = vegList.reduce<number>(
                        (s: number, p: Point, j: number) =>
                            s +
                            (i !== j && distance(vegList[i], p) < 30 ? 1 : 0),
                        0
                    );
                    return count > 2;
                },
                this
            );

            // BOTTOM_

            generateVegetate(
                elementArray,
                function (x, y) {
                    const treeHeight =
                        ((height + y) / height) * PRNG.random(60, 120);
                    const baseCurve = PRNG.random(0, 0.1);
                    const basePower = 1;
                    const noise =
                        Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return new Tree03(
                        x + xOffset,
                        y + yOffset,
                        treeHeight,
                        BOTTOM_COLORNOALFA + noise.toFixed(3) + ")",
                        (x) => Math.pow(x * baseCurve, basePower)
                    );
                },
                function (i, j) {
                    const noise = Perlin.noise(i * 0.2, j * 0.05, seed);
                    return (
                        (j === 0 || j === elementArray[i].length - 1) &&
                        Math.pow(noise, 4) < 0.012
                    );
                },
                () => true,
                this
            );
        }

        // BOTTOM_ ARCH

        generateVegetate(
            elementArray,
            function (x, y): Structure {
                const treeType = PRNG.randomChoice([0, 0, 1, 1, 1, 2]);

                if (treeType === 1) {
                    return new House(
                        x + xOffset,
                        y + yOffset,
                        PRNG.normalizedRandom(40, 70),
                        PRNG.randomChoice([1, 2, 2, 3]),
                        PRNG.random(),
                        PRNG.randomChoice([0, 1, 2]),
                        PRNG.randomChoice([true, false])
                    );
                } else if (treeType === 2) {
                    return new generateTower(
                        x + xOffset,
                        y + yOffset,
                        PRNG.randomChoice([1, 1, 1, 2, 2])
                    );
                }

                return new Structure();
            },
            function (i, j) {
                const noise = Perlin.noise(i * 0.2, j * 0.05, seed + 10);
                return (
                    i !== 0 &&
                    (j === 1 || j === elementArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.008
                );
            },
            () => true,
            this
        );

        // TOP_ ARCH

        generateVegetate(
            elementArray,
            function (x, y) {
                return new Pagoda(
                    x + xOffset,
                    y + yOffset,
                    PRNG.random(40, 20),
                    PRNG.randomChoice([5, 7])
                );
            },
            function (i, j) {
                return (
                    i === 1 &&
                    Math.abs(j - elementArray[i].length / 2) < 1 &&
                    PRNG.random() < 0.02
                );
            },
            () => true,
            this
        );
        // TRANSMISSION TOWER

        generateVegetate(
            elementArray,
            function (x, y) {
                return new TransmissionTower(x + xOffset, y + yOffset);
            },
            function (i, j) {
                const noise = Perlin.noise(
                    i * 0.2,
                    j * 0.05,
                    seed + 20 * Math.PI
                );
                return (
                    i % 2 === 0 &&
                    (j === 1 || j === elementArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.002
                );
            },
            () => true,
            this
        );

        // BOTTOM_ ROCK
        generateVegetate(
            elementArray,
            function (x, y) {
                return new Rock(
                    x + xOffset,
                    y + yOffset,
                    seed,
                    PRNG.random(20, 40),
                    2,
                    PRNG.random(20, 40)
                );
            },
            function (i, j) {
                return (
                    (j === 0 || j === elementArray[i].length - 1) &&
                    PRNG.random() < 0.1
                );
            },
            () => true,
            this
        );
    }
}
