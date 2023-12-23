import Point from "../Point";
import { Noise } from "../PerlinNoise";
import PRNG from "../PRNG";
import Tree01 from "../complexSvgs/Tree01";
import Tree02 from "../complexSvgs/Tree02";
import Tree03 from "../complexSvgs/Tree03";
import House from "../complexSvgs/House";
import TransmissionTower from "../complexSvgs/TransmissionTower";
import Pagoda from "../complexSvgs/Pagoda";
import generateTower from "../complexSvgs/Tower";
import Rock from "../complexSvgs/Rock";
import MountainFoot from "../complexSvgs/MountainFoot";
import Stroke from "../svgPolylines/Stroke";
import Texture from "../complexSvgs/Texture";
import SvgPolyline from "../SvgPolyline";
import Chunk from "../Chunk";
import { distance } from "../../utils/polytools";
import ComplexSvg from "../ComplexSvg";
import { generateVegetate } from "../../utils/generateVegetate";

/**
 * Represents a mountainous landscape with various elements.
 *
 * @extends Chunk
 */
export default class MountainChunk extends Chunk {
    /**
     * Constructor for generating a mountainous landscape with various elements.
     *
     * @param {PRNG} prng - The pseudo-random number generator.
     * @param {number} xOffset - The x-axis offset.
     * @param {number} yOffset - The y-axis offset.
     * @param {number} [seed=0] - The seed for noise functions.
     */
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        seed: number = 0
    ) {
        super("mount", xOffset, yOffset);

        const height: number = prng.random(100, 500);
        const strokeWidth: number = prng.random(400, 600);
        const textureSize: number = 200;
        const vegetation: boolean = true;

        const pointArray: Point[][] = [];
        const reso = [10, 50];

        let heightOffset = 0;

        for (let j = 0; j < reso[0]; j++) {
            heightOffset += prng.random(0, yOffset / 100);
            pointArray.push([]);

            for (let i = 0; i < reso[1]; i++) {
                const x = (i / reso[1] - 0.5) * Math.PI;
                const y =
                    Math.cos(x) * Noise.noise(prng, x + 10, j * 0.15, seed);

                const p = 1 - j / reso[0];
                pointArray[pointArray.length - 1].push(
                    new Point(
                        (x / Math.PI) * strokeWidth * p,
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
                    Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    prng,
                    x + xOffset,
                    y + yOffset - 5,
                    `rgba(100,100,100,${noise.toFixed(3)})`,
                    2
                );
            },
            function (i, j) {
                const noise = Noise.noise(prng, j * 0.1, seed);
                return (
                    i === 0 &&
                    noise * noise * noise < 0.1 &&
                    Math.abs(pointArray[i][j].y) / height > 0.2
                );
            },
            (_v, _i) => true,
            this
        );

        // WHITE BG
        this.add(
            new SvgPolyline(
                pointArray[0].concat([new Point(0, reso[0] * 4)]),
                xOffset,
                yOffset,
                "white",
                "none"
            )
        );

        // OUTLINE
        this.add(
            new Stroke(
                prng,
                pointArray[0].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                "rgba(100,100,100,0.3)",
                "rgba(100,100,100,0.3)",
                3,
                1
            )
        );

        this.add(new MountainFoot(prng, pointArray, xOffset, yOffset));

        this.add(
            new Texture(
                prng,
                pointArray,
                xOffset,
                yOffset,
                textureSize,
                prng.randomChoice([0, 0, 0, 0, 5])
            )
        );

        // TOP
        generateVegetate(
            pointArray,
            function (x, y) {
                const noise =
                    Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return new Tree02(
                    prng,
                    x + xOffset,
                    y + yOffset,
                    `rgba(100,100,100,${noise.toFixed(3)})`
                );
            },
            function (i, j) {
                const noise = Noise.noise(prng, i * 0.1, j * 0.1, seed + 2);
                return (
                    Math.pow(noise, 3) < 0.1 &&
                    Math.abs(pointArray[i][j].y) / height > 0.5
                );
            },
            (_v, _i) => true,
            this
        );

        if (vegetation) {
            // MIDDLE

            generateVegetate(
                pointArray,
                function (x, y) {
                    const treeHeight =
                        ((height + y) / height) * 70 * prng.random(0.3, 1);
                    const noise =
                        Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return new Tree01(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        treeHeight,
                        prng.random(1, 4),
                        `rgba(100,100,100,${noise.toFixed(3)})`
                    );
                },
                function (i, j): boolean {
                    const noise = Noise.noise(prng, i * 0.2, j * 0.05, seed);
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
                        ((height + y) / height) * prng.random(60, 120);
                    const baseCurve = prng.random(0, 0.1);
                    const basePower = 1;
                    const noise =
                        Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return new Tree03(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        treeHeight,
                        `rgba(100,100,100,${noise.toFixed(3)})`,
                        (x) => Math.pow(x * baseCurve, basePower)
                    );
                },
                function (i, j) {
                    const noise = Noise.noise(prng, i * 0.2, j * 0.05, seed);
                    return (
                        (j === 0 || j === pointArray[i].length - 1) &&
                        Math.pow(noise, 4) < 0.012
                    );
                },
                (_vegList, _i) => true,
                this
            );
        }

        // BOTTOM ARCH

        generateVegetate(
            pointArray,
            function (x, y): ComplexSvg {
                const treeType = prng.randomChoice([0, 0, 1, 1, 1, 2]);

                if (treeType === 1) {
                    return new House(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        prng.normalizedRandom(40, 70),
                        prng.randomChoice([1, 2, 2, 3]),
                        prng.random(),
                        prng.randomChoice([1, 2, 3])
                    );
                } else if (treeType === 2) {
                    return new generateTower(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        prng.randomChoice([1, 1, 1, 2, 2])
                    );
                }

                return new ComplexSvg();
            },
            function (i, j) {
                const noise = Noise.noise(prng, i * 0.2, j * 0.05, seed + 10);
                return (
                    i !== 0 &&
                    (j === 1 || j === pointArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.008
                );
            },
            (_vegList, _i) => true,
            this
        );

        // TOP ARCH

        generateVegetate(
            pointArray,
            function (x, y) {
                return new Pagoda(
                    prng,
                    x + xOffset,
                    y + yOffset,
                    prng.random(40, 20),
                    prng.randomChoice([5, 7])
                );
            },
            function (i, j) {
                return (
                    i === 1 &&
                    Math.abs(j - pointArray[i].length / 2) < 1 &&
                    prng.random() < 0.02
                );
            },
            (_vegList, _i) => true,
            this
        );
        // TRANSMISSION TOWER

        generateVegetate(
            pointArray,
            function (x, y) {
                return new TransmissionTower(prng, x + xOffset, y + yOffset);
            },
            function (i, j) {
                const noise = Noise.noise(
                    prng,
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
            (_vegList, _i) => true,
            this
        );

        // BOTTOM ROCK
        generateVegetate(
            pointArray,
            function (x, y) {
                return new Rock(
                    prng,
                    x + xOffset,
                    y + yOffset,
                    seed,
                    prng.random(20, 40),
                    2,
                    prng.random(20, 40)
                );
            },
            function (i, j) {
                return (
                    (j === 0 || j === pointArray[i].length - 1) &&
                    prng.random() < 0.1
                );
            },
            (_vegList, _i) => true,
            this
        );
    }
}
