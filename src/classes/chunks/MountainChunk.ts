import Chunk from "../Chunk";
import ComplexSvg from "../ComplexSvg";
import House from "../complexSvgs/House";
import MountainFoot from "../complexSvgs/MountainFoot";
import PRNG from "../PRNG";
import Pagoda from "../complexSvgs/Pagoda";
import Perlin from "../Perlin";
import Point from "../Point";
import Rock from "../complexSvgs/Rock";
import Stroke from "../svgPolylines/Stroke";
import SvgPolyline from "../SvgPolyline";
import Texture from "../complexSvgs/Texture";
import TransmissionTower from "../complexSvgs/TransmissionTower";
import Tree01 from "../complexSvgs/Tree01";
import Tree02 from "../complexSvgs/Tree02";
import Tree03 from "../complexSvgs/Tree03";
import generateTower from "../complexSvgs/Tower";
import { config } from "../../config";
import { distance } from "../../utils/polytools";
import { generateVegetate } from "../../utils/generateVegetate";

const BACKGROUNDFILLCOLOR = config.chunks.mountain.background.fillColor;
const BACKGROUNDSTROKECOLOR = config.chunks.mountain.background.strokeColor;
const BOTTOMCOLORNOALFA = config.chunks.mountain.bottom.colorNoAlfa;
const DEFAULTHEIGTHMAX = config.chunks.mountain.defaultHeight.max;
const DEFAULTHEIGTHMIN = config.chunks.mountain.defaultHeight.min;
const DEFAULTMIDDLEVEGETATION = config.chunks.mountain.defaultMiddleVegetation;
const DEFAULTSEED = config.chunks.mountain.defaultSeed;
const DEFAULTWIDTHMAX = config.chunks.mountain.defaultWidth.max;
const DEFAULTWIDTHMIN = config.chunks.mountain.defaultWidth.min;
const MIDDLECOLORNOALFA = config.chunks.mountain.middle.colorNoAlfa;
const OUTLINECOLOR = config.chunks.mountain.outline.color;
const OUTLINEFILLCOLOR = config.chunks.mountain.outline.fillColor;
const OUTLINESTROKENOISE = config.chunks.mountain.outline.strokeNoise;
const OUTLINESTROKEWIDTH = config.chunks.mountain.outline.strokeWidth;
const RIMCLUSTERS = config.chunks.mountain.rim.clusters;
const RIMCOLORNOALFA = config.chunks.mountain.rim.colorNoAlfa;
const TEXTURESIZE = config.chunks.mountain.texture.size;
const TOPCOLORNOALFA = config.chunks.mountain.top.colorNoAlfa;

/**
 * Represents a mountainous landscape with various elements.
 *
 * @extends Chunk
 */
export default class MountainChunk extends Chunk {
    /**
     * Constructor for generating a mountainous landscape with various elements.
     *
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=DEFAULTSEED] - The seed for noise functions.
     * @param {number} [height =PRNG.random(DEFAULTHEIGHTMIN, DEFAULTHEIGHTMAX)] - The height of the mountain.
     * @param {number} [width =PRNG.random(DEFAULTWIDTHMIN, DEFAULTWIDTHMAX)] - The width of the mountain.

     */
    constructor(
        xOffset: number,
        yOffset: number,
        seed: number = DEFAULTSEED,
        height: number = PRNG.random(DEFAULTHEIGTHMIN, DEFAULTHEIGTHMAX),
        width: number = PRNG.random(DEFAULTWIDTHMIN, DEFAULTWIDTHMAX)
    ) {
        super("mount", xOffset, yOffset);

        const pointArray: Point[][] = [];
        const reso = [10, 50];

        let heightOffset = 0;

        for (let j = 0; j < reso[0]; j++) {
            heightOffset += PRNG.random(0, yOffset / 100);
            pointArray.push([]);

            for (let i = 0; i < reso[1]; i++) {
                const x = (i / reso[1] - 0.5) * Math.PI;
                const y = Math.cos(x) * Perlin.noise(x + 10, j * 0.15, seed);

                const p = 1 - j / reso[0];
                pointArray[pointArray.length - 1].push(
                    new Point(
                        (x / Math.PI) * width * p,
                        -y * height * p + heightOffset
                    )
                );
            }
        }

        // RIM

        generateVegetate(
            pointArray,
            function (x, y) {
                const noise =
                    Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    x + xOffset,
                    y + yOffset - 5,
                    RIMCOLORNOALFA + noise.toFixed(3) + ")",
                    RIMCLUSTERS
                );
            },
            function (i, j) {
                const noise = Perlin.noise(j * 0.1, seed);
                return (
                    i === 0 &&
                    noise * noise * noise < 0.1 &&
                    Math.abs(pointArray[i][j].y) / height > 0.2
                );
            },
            () => true,
            this
        );

        // WHITE BG
        this.add(
            new SvgPolyline(
                pointArray[0].concat([new Point(0, reso[0] * 4)]),
                xOffset,
                yOffset,
                BACKGROUNDFILLCOLOR,
                BACKGROUNDSTROKECOLOR
            )
        );

        // OUTLINE
        this.add(
            new Stroke(
                pointArray[0].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                OUTLINEFILLCOLOR,
                OUTLINECOLOR,
                OUTLINESTROKEWIDTH,
                OUTLINESTROKENOISE
            )
        );

        this.add(new MountainFoot(pointArray, xOffset, yOffset));

        this.add(
            new Texture(
                pointArray,
                xOffset,
                yOffset,
                TEXTURESIZE,
                PRNG.randomChoice([2, 1, 3])
            )
        );

        // TOP
        generateVegetate(
            pointArray,
            function (x, y) {
                const noise =
                    Perlin.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    x + xOffset,
                    y + yOffset,
                    TOPCOLORNOALFA + noise.toFixed(3) + ")"
                );
            },
            function (i, j) {
                const noise = Perlin.noise(i * 0.1, j * 0.1, seed + 2);
                return (
                    Math.pow(noise, 3) < 0.1 &&
                    Math.abs(pointArray[i][j].y) / height > 0.5
                );
            },
            () => true,
            this
        );

        if (DEFAULTMIDDLEVEGETATION) {
            // MIDDLE

            generateVegetate(
                pointArray,
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
                        MIDDLECOLORNOALFA + noise.toFixed(3) + ")"
                    );
                },
                function (i, j): boolean {
                    const noise = Perlin.noise(i * 0.2, j * 0.05, seed);
                    return (
                        j % 2 !== 0 &&
                        Math.pow(noise, 4) < 0.012 &&
                        Math.abs(pointArray[i][j].y) / height < 0.3
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

            // BOTTOM

            generateVegetate(
                pointArray,
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
                        BOTTOMCOLORNOALFA + noise.toFixed(3) + ")",
                        (x) => Math.pow(x * baseCurve, basePower)
                    );
                },
                function (i, j) {
                    const noise = Perlin.noise(i * 0.2, j * 0.05, seed);
                    return (
                        (j === 0 || j === pointArray[i].length - 1) &&
                        Math.pow(noise, 4) < 0.012
                    );
                },
                () => true,
                this
            );
        }

        // BOTTOM ARCH

        generateVegetate(
            pointArray,
            function (x, y): ComplexSvg {
                const treeType = PRNG.randomChoice([0, 0, 1, 1, 1, 2]);

                if (treeType === 1) {
                    return new House(
                        x + xOffset,
                        y + yOffset,
                        PRNG.normalizedRandom(40, 70),
                        PRNG.randomChoice([1, 2, 2, 3]),
                        PRNG.random(),
                        PRNG.randomChoice([1, 2, 3])
                    );
                } else if (treeType === 2) {
                    return new generateTower(
                        x + xOffset,
                        y + yOffset,
                        PRNG.randomChoice([1, 1, 1, 2, 2])
                    );
                }

                return new ComplexSvg();
            },
            function (i, j) {
                const noise = Perlin.noise(i * 0.2, j * 0.05, seed + 10);
                return (
                    i !== 0 &&
                    (j === 1 || j === pointArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.008
                );
            },
            () => true,
            this
        );

        // TOP ARCH

        generateVegetate(
            pointArray,
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
                    Math.abs(j - pointArray[i].length / 2) < 1 &&
                    PRNG.random() < 0.02
                );
            },
            () => true,
            this
        );
        // TRANSMISSION TOWER

        generateVegetate(
            pointArray,
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
                    (j === 1 || j === pointArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.002
                );
            },
            () => true,
            this
        );

        // BOTTOM ROCK
        generateVegetate(
            pointArray,
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
                    (j === 0 || j === pointArray[i].length - 1) &&
                    PRNG.random() < 0.1
                );
            },
            () => true,
            this
        );
    }
}
