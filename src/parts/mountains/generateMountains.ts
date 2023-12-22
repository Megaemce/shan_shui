import { Point } from "../../classes/Point";
import { distance } from "../../utils/utils";
import { Noise } from "../../classes/PerlinNoise";
import { generateStroke } from "../brushes/generateStroke";
import { generateTexture } from "../brushes/generateTexture";
import { generateTree03 } from "../trees/generateTree03";
import { generateTree02 } from "../trees/generateTree02";
import { generateTree01 } from "../trees/generateTree01";
import { generateTransmissionTower } from "../architectures/generateTransmissionTower";
import { generateTower } from "../architectures/generateTower";
import { generatePagoda } from "../architectures/generatePagoda";
import { generateHouse } from "../architectures/generateHouse";
import { Bound } from "../../classes/Bound";
import { PRNG } from "../../classes/PRNG";
import { ISvgElement } from "../../interfaces/ISvgElement";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { Chunk } from "../../classes/Chunk";
import { generateRock } from "./generateRock";

/**
 * Generates a representation of a foot using a given set of points.
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {Point[][]} pointArray - An array of arrays representing the points.
 * @param {number} xOffset - X-coordinate offset for the foot.
 * @param {number} yOffset - Y-coordinate offset for the foot.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the foot.
 */
export function generateFoot(
    prng: PRNG,
    pointArray: Point[][],
    xOffset: number = 0,
    yOffset: number = 0
): SvgPolyline[] {
    const footArray: Point[][] = [];
    const span = 10;
    let ni = 0;

    for (let i = 0; i < pointArray.length - 2; i += 1) {
        if (i !== ni) continue;

        ni = Math.min(ni + prng.randomChoice([1, 2]), pointArray.length - 1);

        footArray.push([]);
        footArray.push([]);

        for (let j = 0; j < Math.min(pointArray[i].length / 8, 10); j++) {
            footArray[footArray.length - 2].push(
                new Point(
                    pointArray[i][j].x + Noise.noise(prng, j * 0.1, i) * 10,
                    pointArray[i][j].y
                )
            );
            footArray[footArray.length - 1].push(
                new Point(
                    pointArray[i][pointArray[i].length - 1 - j].x -
                        Noise.noise(prng, j * 0.1, i) * 10,
                    pointArray[i][pointArray[i].length - 1 - j].y
                )
            );
        }

        footArray[footArray.length - 2].reverse();
        footArray[footArray.length - 1].reverse();

        for (let j = 0; j < span; j++) {
            const p = j / span;
            const x1 = pointArray[i][0].x * (1 - p) + pointArray[ni][0].x * p;
            let y1 = pointArray[i][0].y * (1 - p) + pointArray[ni][0].y * p;

            const x2 =
                pointArray[i][pointArray[i].length - 1].x * (1 - p) +
                pointArray[ni][pointArray[i].length - 1].x * p;
            let y2 =
                pointArray[i][pointArray[i].length - 1].y * (1 - p) +
                pointArray[ni][pointArray[i].length - 1].y * p;

            const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
            y1 += vib * 5 + Noise.noise(prng, xOffset * 0.05, i) * 5;
            y2 += vib * 5 + Noise.noise(prng, xOffset * 0.05, i) * 5;

            footArray[footArray.length - 2].push(new Point(x1, y1));
            footArray[footArray.length - 1].push(new Point(x2, y2));
        }
    }

    const polylines: SvgPolyline[] = [];

    for (let i = 0; i < footArray.length; i++) {
        polylines.push(
            SvgPolyline.createPolyline(
                footArray[i],
                xOffset,
                yOffset,
                "white",
                "none"
            )
        );
    }

    for (let j = 0; j < footArray.length; j++) {
        const color = `rgba(100,100,100,${prng.random(0.1, 0.2).toFixed(3)})`;
        polylines.push(
            generateStroke(
                prng,
                footArray[j].map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                color,
                color,
                1
            )
        );
    }

    return polylines;
}

/**
 * Generate vegetation elements based on specified growth and proof rules.
 * @notExported
 * @param {Point[][]} pointArray - 2D array of points representing the terrain.
 * @param {(x: number, y: number) => ISvgElement[]} treeFunc - Function to generate vegetation elements at a given location.
 * @param {(i: number, j: number) => boolean} growthRule - Rule determining whether vegetation should grow at a specific point.
 * @param {(pl: Point[], i: number) => boolean} proofRule - Rule providing additional conditions for vegetation growth.
 * @returns {ISvgElement[]} List of SVG elements representing vegetation.
 */
function generateVegetate(
    pointArray: Point[][],
    treeFunc: (x: number, y: number) => ISvgElement[],
    growthRule: (i: number, j: number) => boolean,
    proofRule: (pl: Point[], i: number) => boolean
): ISvgElement[] {
    const elementLists: ISvgElement[][] = [];
    const vegList: Point[] = [];

    // Collect points where vegetation can potentially grow based on growthRule
    for (let i = 0; i < pointArray.length; i += 1) {
        for (let j = 0; j < pointArray[i].length; j += 1) {
            if (growthRule(i, j)) {
                vegList.push(pointArray[i][j].copy());
            }
        }
    }

    // Check additional proofRule conditions and generate vegetation elements
    for (let i = 0; i < vegList.length; i++) {
        if (proofRule(vegList, i)) {
            elementLists.push(treeFunc(vegList[i].x, vegList[i].y));
        }
    }

    return elementLists.flat();
}

/**
 * Generate a mountainous landscape with various elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {number} [seed=0] - The seed for noise functions.
 * @returns {Chunk} The generated mountain chunk.
 */
export function generateMountain(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0
): Chunk {
    const height: number = prng.random(100, 500);
    const strokeWidth: number = prng.random(400, 600);
    const textureSize: number = 200;
    const vegetation: boolean = true;

    const elementLists: ISvgElement[][] = [];
    const pointArray: Point[][] = [];
    const reso = [10, 50];

    let heightOffset = 0;

    for (let j = 0; j < reso[0]; j++) {
        heightOffset += prng.random(0, yOffset / 100);
        pointArray.push([]);

        for (let i = 0; i < reso[1]; i++) {
            const x = (i / reso[1] - 0.5) * Math.PI;
            const y = Math.cos(x) * Noise.noise(prng, x + 10, j * 0.15, seed);

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
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y) {
                const noise =
                    Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return generateTree02(
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
            (_v, _i) => true
        )
    );

    // WHITE BG
    elementLists.push([
        SvgPolyline.createPolyline(
            pointArray[0].concat([new Point(0, reso[0] * 4)]),
            xOffset,
            yOffset,
            "white",
            "none"
        ),
    ]);

    // OUTLINE
    elementLists.push([
        generateStroke(
            prng,
            pointArray[0].map(function (p) {
                return new Point(p.x + xOffset, p.y + yOffset);
            }),
            "rgba(100,100,100,0.3)",
            "rgba(100,100,100,0.3)",
            3,
            1
        ),
    ]);

    elementLists.push(generateFoot(prng, pointArray, xOffset, yOffset));

    elementLists.push(
        generateTexture(
            prng,
            pointArray,
            xOffset,
            yOffset,
            textureSize,
            prng.randomChoice([0, 0, 0, 0, 5])
        )
    );

    // TOP
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y) {
                const noise =
                    Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5;

                return generateTree02(
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
            (_v, _i) => true
        )
    );

    if (vegetation) {
        // MIDDLE
        elementLists.push(
            generateVegetate(
                pointArray,
                function (x, y) {
                    const treeHeight =
                        ((height + y) / height) * 70 * prng.random(0.3, 1);
                    const noise =
                        Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return generateTree01(
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
                }
            )
        );

        // BOTTOM
        elementLists.push(
            generateVegetate(
                pointArray,
                function (x, y) {
                    const treeHeight =
                        ((height + y) / height) * prng.random(60, 120);
                    const baseCurve = prng.random(0, 0.1);
                    const basePower = 1;
                    const noise =
                        Noise.noise(prng, 0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3;

                    return generateTree03(
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
                (_vegList, _i) => true
            )
        );
    }

    // BOTTOM ARCH
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y): ISvgElement[] {
                const treeType = prng.randomChoice([0, 0, 1, 1, 1, 2]);

                if (treeType === 1) {
                    return generateHouse(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        prng.normalizedRandom(40, 70),
                        prng.randomChoice([1, 2, 2, 3]),
                        prng.random(),
                        prng.randomChoice([1, 2, 3])
                    );
                } else if (treeType === 2) {
                    return generateTower(
                        prng,
                        x + xOffset,
                        y + yOffset,
                        prng.randomChoice([1, 1, 1, 2, 2])
                    );
                } else {
                    return [];
                }
            },
            function (i, j) {
                const noise = Noise.noise(prng, i * 0.2, j * 0.05, seed + 10);
                return (
                    i !== 0 &&
                    (j === 1 || j === pointArray[i].length - 2) &&
                    Math.pow(noise, 4) < 0.008
                );
            },
            (_vegList, _i) => true
        )
    );

    // TOP ARCH
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y) {
                return generatePagoda(
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
            (_vegList, _i) => true
        )
    );

    // TRANSMISSION TOWER
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y) {
                return generateTransmissionTower(
                    prng,
                    x + xOffset,
                    y + yOffset
                );
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
            (_vegList, _i) => true
        )
    );

    // BOTTOM ROCK
    elementLists.push(
        generateVegetate(
            pointArray,
            function (x, y) {
                return generateRock(
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
            (_vegList, _i) => true
        )
    );

    const chunk: Chunk = new Chunk(
        "mount",
        xOffset,
        yOffset,
        elementLists.flat()
    );
    return chunk;
}

/**
 * Calculate the bounding box of a list of points.
 *
 * @param {Point[]} pointArray - The list of points.
 * @returns {Bound} The bounding box.
 */
export function calculateBoundingBox(pointArray: Point[]): Bound {
    let minX = pointArray[0].x;
    let maxX = pointArray[0].x;
    let minY = pointArray[0].y;
    let maxY = pointArray[0].y;

    pointArray.forEach((point) => {
        if (point.x < minX) {
            minX = point.x;
        }
        if (point.x > maxX) {
            maxX = point.x;
        }
        if (point.y < minY) {
            minY = point.y;
        }
        if (point.y > maxY) {
            maxY = point.y;
        }
    });

    return new Bound(minX, maxX, minY, maxY);
}
