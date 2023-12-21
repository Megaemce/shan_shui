import { distance, Point } from "../basic/point";
import { normalizeNoise } from "../basic/utils";
import { createPolyline } from "../svg/createPolyline";
import { Noise } from "../basic/perlinNoise";
import { div, generateStroke, generateTexture } from "./brushes";
import {
    generateTree01,
    generateTree02,
    generateTree03,
    generateTree04,
    generateTree05,
    generateTree06,
    generateTree07,
    generateTree08,
} from "./trees";
import {
    generatePavilion,
    generateHouse,
    generatePagoda,
    generateTower,
    generateTransmissionTower,
} from "./architectures";
import { midPoint, triangulate } from "../basic/polytools";
import { Bound } from "../basic/range";
import { PRNG } from "../basic/PRNG";
import { ISvgElement, SvgPolyline } from "../svg";
import { Chunk } from "../basic/chunk";

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
            createPolyline(footArray[i], xOffset, yOffset, "white", "none")
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
        createPolyline(
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

/**
 * Generate a flat mountain chunk with optional vegetation and textures.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {number} [seed=0] - The seed value for noise functions.
 * @param {number} [height] - The height of the mountain.
 * @param {number} [flatness=0.5] - Parameter controlling the flatness of the mountain.
 * @param {number} [strokeWidth] - The stroke width of the mountain outline.
 * @returns {Chunk} The generated mountain chunk.
 */
export function generateFlatMountain(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = prng.random(40, 440),
    flatness: number = 0.5,
    strokeWidth: number = prng.random(400, 600)
): Chunk {
    const textureCount: number = 80;
    const polylineArray: SvgPolyline[][] = [];
    const pointArray: Point[][] = [];
    const reso = [5, 50];
    const flat: Point[][] = [];

    let heightOffset = 0;

    for (let j = 0; j < reso[0]; j++) {
        heightOffset += prng.random(0, yOffset / 100);
        pointArray.push([]);
        flat.push([]);

        for (let i = 0; i < reso[1]; i++) {
            const x = (i / reso[1] - 0.5) * Math.PI;
            const y =
                (Math.cos(x * 2) + 1) *
                Noise.noise(prng, x + 10, j * 0.1, seed);
            const p = 1 - (j / reso[0]) * 0.6;
            const newX = (x / Math.PI) * strokeWidth * p;
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
    polylineArray.push([
        createPolyline(
            pointArray[0].concat([new Point(0, reso[0] * 4)]),
            xOffset,
            yOffset,
            "white",
            "none"
        ),
    ]);

    // OUTLINE
    polylineArray.push([
        generateStroke(
            prng,
            pointArray[0].map((p) => new Point(p.x + xOffset, p.y + yOffset)),
            "rgba(100,100,100,0.3)",
            "rgba(100,100,100,0.3)",
            3,
            1
        ),
    ]);

    // TEXTURE
    polylineArray.push(
        generateTexture(
            prng,
            pointArray,
            xOffset,
            yOffset,
            textureCount,
            0,
            () => 0.5 + prng.randomSign() * prng.random(0, 0.4)
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
        const chunk = new Chunk(
            "flatmount",
            xOffset,
            yOffset,
            polylineArray.flat()
        );
        return chunk;
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
    const grlist1 = div(_grlist1, d);
    const grlist2 = div(_grlist2, d);

    const grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));

    for (let i = 0; i < grlist.length; i++) {
        const v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
        grlist[i].x *= 1 - v + Noise.noise(prng, grlist[i].y * 0.5) * v;
    }

    polylineArray.push([
        createPolyline(grlist, xOffset, yOffset, "white", "none", 2),
    ]);
    polylineArray.push([
        generateStroke(
            prng,
            grlist.map((p) => new Point(p.x + xOffset, p.y + yOffset)),
            "rgba(100,100,100,0.2)",
            "rgba(100,100,100,0.2)",
            3
        ),
    ]);

    polylineArray.push(
        generateFlatDecorations(
            prng,
            xOffset,
            yOffset,
            calculateBoundingBox(grlist)
        )
    );

    const chunk = new Chunk(
        "flatmount",
        xOffset,
        yOffset,
        polylineArray.flat()
    );
    return chunk;
}

/**
 * Generate decorative elements for a flat mountain chunk based on its bounding box.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {Bound} bounding - The bounding box of the flat mountain.
 * @returns {SvgPolyline[]} An array of SVG polylines representing the decorative elements.
 */
export function generateFlatDecorations(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    bounding: Bound
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];

    const tt = prng.randomChoice([0, 0, 1, 2, 3, 4]);

    for (let j = 0; j < prng.random(0, 5); j++) {
        polylineArray.push(
            generateRock(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset +
                    (bounding.yMin + bounding.yMax) / 2 +
                    prng.normalizedRandom(-10, 10) +
                    10,
                prng.random(0, 100),
                prng.random(10, 30),
                2,
                prng.random(10, 30)
            )
        );
    }

    for (let j = 0; j < prng.randomChoice([0, 0, 1, 2]); j++) {
        const xr =
            xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax);
        const yr =
            yOffset +
            (bounding.yMin + bounding.yMax) / 2 +
            prng.normalizedRandom(-5, 5) +
            20;

        for (let k = 0; k < prng.random(2, 5); k++) {
            polylineArray.push(
                generateTree08(
                    prng,
                    xr +
                        Math.min(
                            Math.max(
                                prng.normalizedRandom(-30, 30),
                                bounding.xMin
                            ),
                            bounding.xMax
                        ),
                    yr,
                    prng.random(60, 100)
                )
            );
        }
    }

    if (tt === 0) {
        for (let j = 0; j < prng.random(0, 3); j++) {
            polylineArray.push(
                generateRock(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-5, 5) +
                        20,
                    prng.random(0, 100),
                    prng.random(40, 60),
                    5,
                    prng.random(50, 70)
                )
            );
        }
    }

    if (tt === 1) {
        const xMid = (bounding.xMin + bounding.xMax) / 2;
        const xMin = prng.random(bounding.xMin, xMid);
        const xMax = prng.random(xMid, bounding.xMax);

        for (let i = xMin; i < xMax; i += 30) {
            polylineArray.push(
                generateTree05(
                    prng,
                    xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                    yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                    prng.random(100, 300)
                )
            );
        }

        for (let j = 0; j < prng.random(0, 4); j++) {
            polylineArray.push(
                generateRock(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-5, 5) +
                        20,
                    prng.random(0, 100),
                    prng.random(40, 60),
                    5,
                    prng.random(50, 70)
                )
            );
        }
    } else if (tt === 2) {
        for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
            const xr = prng.normalizedRandom(bounding.xMin, bounding.xMax);
            const yr = (bounding.yMin + bounding.yMax) / 2;
            polylineArray.push(
                generateTree04(prng, xOffset + xr, yOffset + yr + 20)
            );

            for (let j = 0; j < prng.random(0, 2); j++) {
                polylineArray.push(
                    generateRock(
                        prng,
                        xOffset +
                            Math.max(
                                bounding.xMin,
                                Math.min(
                                    bounding.xMax,
                                    xr + prng.normalizedRandom(-50, 50)
                                )
                            ),
                        yOffset + yr + prng.normalizedRandom(-5, 5) + 20,
                        prng.random(100 * i * j),
                        prng.random(40, 60),
                        5,
                        prng.random(50, 70)
                    )
                );
            }
        }
    } else if (tt === 3) {
        for (let i = 0; i < prng.randomChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
            polylineArray.push(
                generateTree06(
                    prng,
                    xOffset +
                        prng.normalizedRandom(bounding.xMin, bounding.xMax),
                    yOffset + (bounding.yMin + bounding.yMax) / 2,
                    prng.random(60, 120)
                )
            );
        }
    } else if (tt === 4) {
        const xMid = (bounding.xMin + bounding.xMax) / 2;
        const xMin = prng.random(bounding.xMin, xMid);
        const xMax = prng.random(xMid, bounding.xMax);

        for (let i = xMin; i < xMax; i += 20) {
            polylineArray.push(
                generateTree07(
                    prng,
                    xOffset + i + 20 * prng.normalizedRandom(-1, 1),
                    yOffset +
                        (bounding.yMin + bounding.yMax) / 2 +
                        prng.normalizedRandom(-1, 1) +
                        0,
                    prng.normalizedRandom(40, 80)
                )
            );
        }
    }

    for (let i = 0; i < prng.random(0, 50); i++) {
        polylineArray.push(
            generateTree02(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset + prng.normalizedRandom(bounding.yMin, bounding.yMax)
            )
        );
    }

    const ts = prng.randomChoice([0, 0, 0, 0, 1]);
    if (ts === 1 && tt !== 4) {
        polylineArray.push(
            generatePavilion(
                prng,
                xOffset + prng.normalizedRandom(bounding.xMin, bounding.xMax),
                yOffset + (bounding.yMin + bounding.yMax) / 2 + 20,
                prng.random(),
                prng.normalizedRandom(80, 100),
                prng.normalizedRandom(160, 200),
                prng.random()
            )
        );
    }

    return polylineArray.flat();
}

/**
 * Generate a distant mountain chunk with varying heights and colors.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {number} [seed=0] - The seed for the noise function. Default is 0.
 * @param {number} [height=300] - The overall height of the mountain. Default is 300.
 * @param {number} [length=2000] - The length of the mountain. Default is 2000.
 * @returns {Chunk} A chunk representing the distant mountain.
 */
export function generateDistantMountain(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = 300,
    length: number = 2000
): Chunk {
    const seg = 5;
    const span = 10;
    const polylines: SvgPolyline[] = [];
    const pointArray: Point[][] = [];

    for (let i = 0; i < length / span / seg; i++) {
        pointArray.push([]);
        for (let j = 0; j < seg + 1; j++) {
            const tran = (k: number) =>
                new Point(
                    xOffset + k * span,
                    yOffset -
                        height *
                            Noise.noise(prng, k * 0.05, seed) *
                            Math.pow(
                                Math.sin((Math.PI * k) / (length / span)),
                                0.5
                            )
                );
            pointArray[pointArray.length - 1].push(tran(i * seg + j));
        }
        for (let j = 0; j < seg / 2 + 1; j++) {
            const tran = (k: number) =>
                new Point(
                    xOffset + k * span,
                    yOffset +
                        24 *
                            Noise.noise(prng, k * 0.05, 2, seed) *
                            Math.pow(
                                Math.sin((Math.PI * k) / (length / span)),
                                1
                            )
                );
            pointArray[pointArray.length - 1].unshift(tran(i * seg + j * 2));
        }
    }

    for (let i = 0; i < pointArray.length; i++) {
        const getCol = function (x: number, y: number) {
            const c = Noise.noise(prng, x * 0.02, y * 0.02, yOffset) * 55 + 200;
            return `rgb(${c},${c},${c})`;
        };
        const pe = pointArray[i][pointArray[i].length - 1];
        polylines.push(
            createPolyline(pointArray[i], 0, 0, getCol(pe.x, pe.y), "none", 1)
        );

        const T = triangulate(pointArray[i], 100, true, false);
        for (let k = 0; k < T.length; k++) {
            const m = midPoint(T[k]);
            const co = getCol(m.x, m.y);
            polylines.push(createPolyline(T[k], 0, 0, co, co, 1));
        }
    }

    const chunk: Chunk = new Chunk("distmount", xOffset, yOffset, polylines);
    return chunk;
}

/**
 * Generate a generateRock with varying heights and textures.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-axis offset.
 * @param {number} yOffset - The y-axis offset.
 * @param {number} [seed=0] - The seed for the noise function. Default is 0.
 * @param {number} [height=80] - The overall height of the generateRock. Default is 80.
 * @param {number} [shadow=10] - The shape parameter affecting texture. Default is 10.
 * @param {number} [strokeWidth=100] - The width of the generateRock. Default is 100.
 * @returns {SvgPolyline[]} An array of polylines representing the generateRock.
 */
export function generateRock(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = 80,
    shadow: number = 10,
    strokeWidth: number = 100
): SvgPolyline[] {
    const textureCount = 40;

    const polylineArray: SvgPolyline[][] = [];

    const reso = [10, 50];
    const pointArray: Point[][] = [];

    for (let i = 0; i < reso[0]; i++) {
        pointArray.push([]);

        const nslist = [];
        for (let j = 0; j < reso[1]; j++) {
            nslist.push(Noise.noise(prng, i, j * 0.2, seed));
        }
        normalizeNoise(nslist);

        for (let j = 0; j < reso[1]; j++) {
            const a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
            let l =
                (strokeWidth * height) /
                Math.sqrt(
                    Math.pow(height * Math.cos(a), 2) +
                        Math.pow(strokeWidth * Math.sin(a), 2)
                );

            l *= 0.7 + 0.3 * nslist[j];

            const p = 1 - i / reso[0];

            const newX = Math.cos(a) * l * p;
            let newY = -Math.sin(a) * l * p;

            if (Math.PI < a || a < 0) {
                newY *= 0.2;
            }

            newY += height * (i / reso[0]) * 0.2;

            pointArray[pointArray.length - 1].push(new Point(newX, newY));
        }
    }

    //WHITE BG
    polylineArray.push([
        createPolyline(
            pointArray[0].concat([new Point(0, 0)]),
            xOffset,
            yOffset,
            "white",
            "none"
        ),
    ]);
    //OUTLINE
    polylineArray.push([
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
    polylineArray.push(
        generateTexture(
            prng,
            pointArray,
            xOffset,
            yOffset,
            textureCount,
            shadow,
            () => 0.5 + prng.randomSign() * prng.random(0.2, 0.35)
        )
    );

    return polylineArray.flat();
}
