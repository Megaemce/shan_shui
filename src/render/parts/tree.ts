import { Noise } from "../basic/perlinNoise";
import { distance, Point, Vector } from "../basic/point";
import { PRNG } from "../basic/PRNG";
import { normalizeNoise } from "../basic/utils";
import { createPolyline } from "../svg/createPolyline";
import { midPoint, triangulate } from "../basic/polytools";
import { SvgPolyline } from "../svg/types";
import { generateBlobPoints, generateBlob, div, stroke } from "./brushes";

/**
 * Generates a list of points representing a branch structure.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} [height=360] - Height of the branch.
 * @param {number} [strokeWidth=6] - Width of the branch.
 * @param {number} [angle=0] - Initial angle of the branch.
 * @param {number} [bendingAngle=0.2 * Math.PI] - Bending angle of the branch.
 * @param {number} [details=10] - Number of details in the branch.
 * @returns {Point[][]} An array of two lists of points representing the branch structure.
 */
export function generateBranch(
    prng: PRNG,
    height: number = 360,
    strokeWidth: number = 6,
    angle: number = 0,
    bendingAngle: number = 0.2 * Math.PI,
    details: number = 10
): Point[][] {
    let newX = 0;
    let newY = 0;
    const tlist = [[newX, newY]];
    let a0 = 0;
    const g = 3;
    for (let i = 0; i < g; i++) {
        a0 += ((prng.random(1, 2) * bendingAngle) / 2) * prng.randomSign();
        newX += (Math.cos(a0) * height) / g;
        newY -= (Math.sin(a0) * height) / g;
        tlist.push([newX, newY]);
    }
    const ta = Math.atan2(
        tlist[tlist.length - 1][1],
        tlist[tlist.length - 1][0]
    );

    for (let i = 0; i < tlist.length; i++) {
        const a = Math.atan2(tlist[i][1], tlist[i][0]);
        const d = Math.sqrt(
            tlist[i][0] * tlist[i][0] + tlist[i][1] * tlist[i][1]
        );
        tlist[i][0] = d * Math.cos(a - ta + angle);
        tlist[i][1] = d * Math.sin(a - ta + angle);
    }

    const trlist1: Point[] = [];
    const trlist2: Point[] = [];
    const span = details;
    const tl = (tlist.length - 1) * span;
    let lx = 0;
    let ly = 0;

    for (let i = 0; i < tl; i += 1) {
        const lastPoint = tlist[Math.floor(i / span)];
        const nextPoint = tlist[Math.ceil(i / span)];
        const p = (i % span) / span;
        const newX = lastPoint[0] * (1 - p) + nextPoint[0] * p;
        const newY = lastPoint[1] * (1 - p) + nextPoint[1] * p;

        const angle = Math.atan2(newY - ly, newX - lx);
        const woff =
            ((Noise.noise(prng, i * 0.3) - 0.5) * strokeWidth * height) / 80;

        let b = 0;
        if (p === 0) {
            b = prng.random() * strokeWidth;
        }

        const nw = strokeWidth * (((tl - i) / tl) * 0.5 + 0.5);
        trlist1.push(
            new Point(
                newX + Math.cos(angle + Math.PI / 2) * (nw + woff + b),
                newY + Math.sin(angle + Math.PI / 2) * (nw + woff + b)
            )
        );
        trlist2.push(
            new Point(
                newX + Math.cos(angle - Math.PI / 2) * (nw - woff + b),
                newY + Math.sin(angle - Math.PI / 2) * (nw - woff + b)
            )
        );
        lx = newX;
        ly = newY;
    }

    return [trlist1, trlist2];
}

/**
 * Generates a twig with branches and leaves.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} tx - X-coordinate of the twig base.
 * @param {number} ty - Y-coordinate of the twig base.
 * @param {number} depth - Depth of the twig branches.
 * @param {number} [angle=0] - Initial angle of the twig.
 * @param {number} [scale=1] - Scale factor of the twig.
 * @param {number} [direction=1] - Direction of the twig branches.
 * @param {number} [strokeWidth=1] - Width of the twig branches.
 * @param {[boolean, number]} [leaves=[true, 12]] - Tuple representing whether leaves should be generated and their number.
 * @returns {SvgPolyline[]} An array of polylines representing the twig.
 */
export function generateTwig(
    prng: PRNG,
    tx: number,
    ty: number,
    depth: number,
    angle: number = 0,
    scale: number = 1,
    direction: number = 1,
    strokeWidth: number = 1,
    leaves: [boolean, number] = [true, 12]
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];
    const twlist: Point[] = [];
    const tl = 10;
    const hs = prng.random(0.5, 1);
    // const fun1 = (x: number) => Math.sqrt(x);
    const fun2 = (x: number) => -1 / Math.pow(x / tl + 1, 5) + 1;

    const tfun = prng.randomChoice([fun2]);
    const a0 = ((prng.random() * Math.PI) / 6) * direction + angle;

    for (let i = 0; i < tl; i++) {
        const mx = direction * tfun(i / tl) * 50 * scale * hs;
        const my = -i * 5 * scale;

        const a = Math.atan2(my, mx);
        const d = Math.pow(mx * mx + my * my, 0.5);

        const newX = Math.cos(a + a0) * d;
        const newY = Math.sin(a + a0) * d;

        twlist.push(new Point(newX + tx, newY + ty));
        if ((i === ((tl / 3) | 0) || i === (((tl * 2) / 3) | 0)) && depth > 0) {
            polylineArray.push(
                generateTwig(
                    prng,
                    newX + tx,
                    newY + ty,
                    depth - 1,
                    angle,
                    scale * 0.8,
                    direction * prng.randomChoice([-1, 1]),
                    strokeWidth,
                    leaves
                )
            );
        }
        if (i === tl - 1 && leaves[0]) {
            for (let j = 0; j < 5; j++) {
                const dj = (j - 2.5) * 5;
                const bfunc = function (x: number) {
                    return x <= 1
                        ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                        : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
                };
                polylineArray.push([
                    generateBlob(
                        prng,
                        newX + tx + Math.cos(angle) * dj * strokeWidth,
                        newY +
                            ty +
                            (Math.sin(angle) * dj - leaves[1] / (depth + 1)) *
                                strokeWidth,
                        angle / 2 +
                            Math.PI / 2 +
                            Math.PI * prng.random(-0.1, 0.1),
                        `rgba(100,100,100,${(0.5 + depth * 0.2).toFixed(3)})`,
                        prng.random(15, 27) * strokeWidth,
                        prng.random(6, 9) * strokeWidth,
                        0.5,
                        bfunc
                    ),
                ]);
            }
        }
    }
    polylineArray.push([
        stroke(
            prng,
            twlist,
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            1,
            0.5,
            1,
            (x) => Math.cos((x * Math.PI) / 2)
        ),
    ]);

    return polylineArray.flat();
}

/**
 * Generates a bark-like structure.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the bark.
 * @param {number} y - Y-coordinate of the bark.
 * @param {number} strokeWidth - Width of the bark.
 * @param {number} angle - Angle of the bark.
 * @returns {SvgPolyline[]} An array of polylines representing the bark.
 */
function generateBark(
    prng: PRNG,
    x: number,
    y: number,
    strokeWidth: number,
    angle: number
): SvgPolyline[] {
    const len = prng.random(10, 20);
    const noi = 0.5;
    const fun = function (x: number) {
        return x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
    };
    const reso = 20.0;
    const polylines: SvgPolyline[] = [];

    const lalist: number[][] = [];
    for (let i = 0; i < reso + 1; i++) {
        const p = (i / reso) * 2;
        const xo = len / 2 - Math.abs(p - 1) * len;
        const yo = (fun(p) * strokeWidth) / 2;
        const a = Math.atan2(yo, xo);
        const l = Math.sqrt(xo * xo + yo * yo);
        lalist.push([l, a]);
    }
    let nslist: number[] = [];
    const n0 = prng.random() * 10;
    for (let i = 0; i < reso + 1; i++) {
        nslist.push(Noise.noise(prng, i * 0.05, n0));
    }

    nslist = normalizeNoise(nslist);
    const brklist: Point[] = [];
    for (let i = 0; i < lalist.length; i++) {
        const ns = nslist[i] * noi + (1 - noi);
        const newX = x + Math.cos(lalist[i][1] + angle) * lalist[i][0] * ns;
        const newY = y + Math.sin(lalist[i][1] + angle) * lalist[i][0] * ns;
        brklist.push(new Point(newX, newY));
    }

    const fr = prng.random();
    polylines.push(
        stroke(
            prng,
            brklist,
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            0.8,
            0,
            0,
            (x) => Math.sin((x + fr) * Math.PI * 3)
        )
    );

    return polylines;
}

/**
 * Generates a bark-like structure by combining two sets of points and adding details.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {Point[][]} trlist - Two lists of points representing the structure to be combined.
 * @returns {SvgPolyline[]} An array of polylines representing the bark-like structure.
 */
export function generateBarkify(
    prng: PRNG,
    x: number,
    y: number,
    trlist: Point[][]
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];

    for (let i = 2; i < trlist[0].length - 1; i++) {
        const a0 = Math.atan2(
            trlist[0][i].y - trlist[0][i - 1].y,
            trlist[0][i].x - trlist[0][i - 1].x
        );
        const a1 = Math.atan2(
            trlist[1][i].y - trlist[1][i - 1].y,
            trlist[1][i].x - trlist[1][i - 1].x
        );
        const p = prng.random();
        const newX = trlist[0][i].x * (1 - p) + trlist[1][i].x * p;
        const newY = trlist[0][i].y * (1 - p) + trlist[1][i].y * p;

        if (prng.random() < 0.2) {
            polylineArray.push([
                generateBlob(
                    prng,
                    newX + x,
                    newY + y,
                    (a0 + a1) / 2,
                    "rgba(100,100,100,0.6)",
                    15,
                    6 - Math.abs(p - 0.5) * 10,
                    1
                ),
            ]);
        } else {
            polylineArray.push(
                generateBark(
                    prng,
                    newX + x,
                    newY + y,
                    5 - Math.abs(p - 0.5) * 10,
                    (a0 + a1) / 2
                )
            );
        }

        if (prng.random() < 0.05) {
            const jl = prng.random(2, 4);
            const xya = prng.randomChoice([
                [trlist[0][i].x, trlist[0][i].y, a0],
                [trlist[1][i].x, trlist[1][i].y, a1],
            ]);

            for (let j = 0; j < jl; j++) {
                polylineArray.push([
                    generateBlob(
                        prng,
                        xya[0] + x + Math.cos(xya[2]) * (j - jl / 2) * 4,
                        xya[1] + y + Math.sin(xya[2]) * (j - jl / 2) * 4,
                        a0 + Math.PI / 2,
                        "rgba(100,100,100,0.6)",
                        prng.random(4, 10),
                        4
                    ),
                ]);
            }
        }
    }

    const trflist = trlist[0].concat(trlist[1].slice().reverse());
    const rglist: Point[][] = [[]];

    for (let i = 0; i < trflist.length; i++) {
        if (prng.random() < 0.5) {
            rglist.push([]);
        } else {
            rglist[rglist.length - 1].push(trflist[i]);
        }
    }

    for (let i = 0; i < rglist.length; i++) {
        rglist[i] = div(rglist[i], 4);

        for (let j = 0; j < rglist[i].length; j++) {
            rglist[i][j].x +=
                (Noise.noise(prng, i, j * 0.1, 1) - 0.5) *
                (15 + 5 * prng.gaussianRandom());
            rglist[i][j].y +=
                (Noise.noise(prng, i, j * 0.1, 2) - 0.5) *
                (15 + 5 * prng.gaussianRandom());
        }

        if (rglist[i].length > 0) {
            polylineArray.push([
                stroke(
                    prng,
                    rglist[i].map(function (p: Point) {
                        return new Point(p.x + x, p.y + y);
                    }),
                    "rgba(100,100,100,0.7)",
                    "rgba(100,100,100,0.7)",
                    1.5,
                    0.5,
                    0
                ),
            ]);
        }
    }

    return polylineArray.flat();
}

/**
 * Generates a tree with undulating branches and leaves.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {number} [height=50] - Height of the tree.
 * @param {number} [strokeWidth=3] - Width of the tree branches.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */
export function generateTree01(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 50,
    strokeWidth: number = 3,
    col: string = "rgba(100,100,100,0.5)"
): SvgPolyline[] {
    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
        nslist.push([
            Noise.noise(prng, i * 0.5),
            Noise.noise(prng, i * 0.5, 0.5),
        ]);
    }

    let leafcol;
    if (col.includes("rgba(")) {
        leafcol = col.replace("rgba(", "").replace(")", "").split(",");
    } else {
        leafcol = ["100", "100", "100", "0.5"];
    }

    const polylines: SvgPolyline[] = [];
    const line1 = [];
    const line2 = [];
    for (let i = 0; i < reso; i++) {
        const newX = x;
        const newY = y - (i * height) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < (reso - i) / 5; j++) {
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(1)})`;
                polylines.push(
                    generateBlob(
                        prng,
                        newX +
                            strokeWidth * prng.random(-0.6, 0.6) * (reso - i),
                        newY + prng.random(-0.5, 0.5) * strokeWidth,
                        (Math.PI / 6) * prng.random(-0.5, 0.5),
                        lcol,
                        prng.random(10, 10 + 4 * (reso - i)),
                        prng.random(3, 9)
                    )
                );
            }
        }
        line1.push(
            new Point(
                newX + (nslist[i][0] - 0.5) * strokeWidth - strokeWidth / 2,
                newY
            )
        );
        line2.push(
            new Point(
                newX + (nslist[i][1] - 0.5) * strokeWidth + strokeWidth / 2,
                newY
            )
        );
    }

    polylines.push(createPolyline(line1, 0, 0, "none", col, 1.5));
    polylines.push(createPolyline(line2, 0, 0, "none", col, 1.5));
    return polylines;
}

/**
 * Generates a tree with blob-like clusters of branches.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @param {number} [clu=5] - Number of blob-like clusters.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */
export function generateTree02(
    prng: PRNG,
    x: number,
    y: number,
    col: string = "rgba(100,100,100,0.5)",
    clu: number = 5
): SvgPolyline[] {
    const height: number = 16,
        strokeWidth: number = 8;

    const polylines: SvgPolyline[] = [];
    const bfunc = (x: number) =>
        x <= 1
            ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
            : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
    for (let i = 0; i < clu; i++) {
        polylines.push(
            generateBlob(
                prng,
                x + prng.gaussianRandom() * clu * 4,
                y + prng.gaussianRandom() * clu * 4,
                Math.PI / 2,
                col,
                prng.random(0.5, 1.25) * height,
                prng.random(0.5, 1.25) * strokeWidth,
                0.5,
                bfunc
            )
        );
    }
    return polylines;
}

/**
 * Generates a tree with branches and leaves influenced by a custom bending function.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the tree base.
 * @param {number} y - Y-coordinate of the tree base.
 * @param {number} [height=16] - Height of the tree.
 * @param {string} [col="rgba(100,100,100,0.5)"] - Color of the tree.
 * @param {(x: number) => number} [bendingAngle=(_) => 0] - Custom bending function.
 * @returns {SvgPolyline[]} An array of polylines representing the tree.
 */
export function generateTree03(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 16,
    col: string = "rgba(100,100,100,0.5)",
    bendingAngle: (x: number) => number = (_) => 0
): SvgPolyline[] {
    const strokeWidth: number = 5;

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
        nslist.push([
            Noise.noise(prng, i * 0.5),
            Noise.noise(prng, i * 0.5, 0.5),
        ]);
    }

    let leafcol;
    if (col.includes("rgba(")) {
        leafcol = col.replace("rgba(", "").replace(")", "").split(",");
    } else {
        leafcol = ["100", "100", "100", "0.5"];
    }
    const polylines: SvgPolyline[] = [];
    const blobs: SvgPolyline[] = [];
    const line1: Point[] = [];
    const line2: Point[] = [];
    for (let i = 0; i < reso; i++) {
        const newX = x + bendingAngle(i / reso) * 100;
        const newY = y - (i * height) / reso;
        if (i >= reso / 5) {
            for (let j = 0; j < (reso - i) * 2; j++) {
                const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
                const ox =
                    prng.random(0, 2) * strokeWidth * shape((reso - i) / reso);
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(3)})`;
                blobs.push(
                    generateBlob(
                        prng,
                        newX + ox * prng.randomChoice([-1, 1]),
                        newY + prng.random(-1, 1) * strokeWidth,
                        (prng.random(-0.5, 0.5) * Math.PI) / 6,
                        lcol,
                        ox * 2,
                        prng.random(3, 9)
                    )
                );
            }
        }
        line1.push(
            new Point(
                newX +
                    (((nslist[i][0] - 0.5) * strokeWidth - strokeWidth / 2) *
                        (reso - i)) /
                        reso,
                newY
            )
        );
        line2.push(
            new Point(
                newX +
                    (((nslist[i][1] - 0.5) * strokeWidth + strokeWidth / 2) *
                        (reso - i)) /
                        reso,
                newY
            )
        );
    }
    const lc = line1.concat(line2.reverse());
    polylines.push(createPolyline(lc, 0, 0, "white", col, 1.5));

    return polylines.concat(blobs);
}

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
export function generateTree04(
    prng: PRNG,
    x: number,
    y: number
): SvgPolyline[] {
    const height: number = 300;
    const strokeWidth: number = 6;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const _trlist = generateBranch(prng, height, strokeWidth, -Math.PI / 2);
    txpolylinelists.push(generateBarkify(prng, x, y, _trlist));
    const trlist: Point[] = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        if (
            (i >= trlist.length * 0.3 &&
                i <= trlist.length * 0.7 &&
                prng.random() < 0.1) ||
            i === trlist.length / 2 - 1
        ) {
            const ba =
                Math.PI * 0.2 - Math.PI * 1.4 * (i > trlist.length / 2 ? 1 : 0);
            const _brlist: Point[][] = generateBranch(
                prng,
                height * prng.random(0.3, 0.6),
                strokeWidth * 0.5,
                ba
            );

            _brlist[0].splice(0, 1);
            _brlist[1].splice(0, 1);
            const foff = function (p: Point) {
                return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
            };

            txpolylinelists.push(
                generateBarkify(prng, x, y, [
                    _brlist[0].map(foff),
                    _brlist[1].map(foff),
                ])
            );

            for (let j = 0; j < _brlist[0].length; j++) {
                if (prng.random() < 0.2 || j === _brlist[0].length - 1) {
                    twpolylinelists.push(
                        generateTwig(
                            prng,
                            _brlist[0][j].x + trlist[i].x + x,
                            _brlist[0][j].y + trlist[i].y + y,
                            1,
                            ba > -Math.PI / 2 ? ba : ba + Math.PI,
                            (0.5 * height) / 300,
                            ba > -Math.PI / 2 ? 1 : -1,
                            height / 300
                        )
                    );
                }
            }
            const brlist = _brlist[0].concat(_brlist[1].reverse());
            trmlist = trmlist.concat(
                brlist.map(function (p: Point) {
                    return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                })
            );
        } else {
            trmlist.push(trlist[i]);
        }
    }

    polylineArray.push([createPolyline(trmlist, x, y, "white", col)]);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;

    polylineArray.push([
        stroke(
            prng,
            trmlist.map(function (p: Point) {
                return new Point(p.x + x, p.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (x) => Math.sin(1)
        ),
    ]);

    polylineArray.push(txpolylinelists.flat());
    polylineArray.push(twpolylinelists.flat());
    return polylineArray.flat();
}

/**
 * Generates a tree-like structure with branches, bark, and twigs.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=300] - The height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
export function generateTree05(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 300
): SvgPolyline[] {
    const strokeWidth: number = 5;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const _trlist = generateBranch(prng, height, strokeWidth, -Math.PI / 2, 0);
    txpolylinelists.push(generateBarkify(prng, x, y, _trlist));
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        const p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
        if (
            (i >= trlist.length * 0.2 &&
                i <= trlist.length * 0.8 &&
                i % 3 === 0 &&
                prng.random() > p) ||
            i === trlist.length / 2 - 1
        ) {
            const bar = prng.random(0, 0.2);
            const ba =
                -bar * Math.PI -
                (1 - bar * 2) * Math.PI * (i > trlist.length / 2 ? 1 : 0);
            const _brlist = generateBranch(
                prng,
                height * (0.3 * p - prng.random(0, 0.05)),
                strokeWidth * 0.5,
                ba,
                0.5
            );

            _brlist[0].splice(0, 1);
            _brlist[1].splice(0, 1);

            for (let j = 0; j < _brlist[0].length; j++) {
                if (j % 20 === 0 || j === _brlist[0].length - 1) {
                    twpolylinelists.push(
                        generateTwig(
                            prng,
                            _brlist[0][j].x + trlist[i].x + x,
                            _brlist[0][j].y + trlist[i].y + y,
                            0,
                            ba > -Math.PI / 2 ? ba : ba + Math.PI,
                            (0.2 * height) / 300,
                            ba > -Math.PI / 2 ? 1 : -1,
                            height / 300,
                            [true, 5]
                        )
                    );
                }
            }
            const brlist = _brlist[0].concat(_brlist[1].reverse());
            trmlist = trmlist.concat(
                brlist.map(function (p) {
                    return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
                })
            );
        } else {
            trmlist.push(trlist[i]);
        }
    }

    polylineArray.push([createPolyline(trmlist, x, y, "white", col)]);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;

    // Tree trunk
    polylineArray.push([
        stroke(
            prng,
            trmlist.map(function (p: Point) {
                return new Point(p.x + x, p.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (x) => Math.sin(1)
        ),
    ]);

    polylineArray.push(txpolylinelists.flat());
    polylineArray.push(twpolylinelists.flat());
    return polylineArray.flat();
}

/**
 * Recursive function to generate a fractal tree-like structure.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {SvgPolyline[][]} txpolylinelists - Lists to store trunk and bark polylines.
 * @param {SvgPolyline[][]} twpolylinelists - Lists to store twig polylines.
 * @param {number} xOffset - X-coordinate offset.
 * @param {number} yOffset - Y-coordinate offset.
 * @param {number} depth - Current depth of recursion.
 * @param {number} [height=300] - Height of the tree.
 * @param {number} [strokeWidth=5] - Width of the strokes.
 * @param {number} [angle=0] - Initial angle of the tree.
 * @param {number} [bendingAngle=0.2 * Math.PI] - Bending angle of the tree.
 * @returns {Point[]} An array of points representing the tree-like structure.
 */
function generateFractalTree06(
    prng: PRNG,
    txpolylinelists: SvgPolyline[][],
    twpolylinelists: SvgPolyline[][],
    xOffset: number,
    yOffset: number,
    depth: number,
    height: number = 300,
    strokeWidth: number = 5,
    angle: number = 0,
    bendingAngle: number = 0.2 * Math.PI
): Point[] {
    const _trlist = generateBranch(
        prng,
        height,
        strokeWidth,
        angle,
        bendingAngle,
        height / 20
    );

    txpolylinelists.push(generateBarkify(prng, xOffset, yOffset, _trlist));
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        if (
            ((prng.random() < 0.025 &&
                i >= trlist.length * 0.2 &&
                i <= trlist.length * 0.8) ||
                i === ((trlist.length / 2) | 0) - 1 ||
                i === ((trlist.length / 2) | 0) + 1) &&
            depth > 0
        ) {
            const bar = prng.random(0.02, 0.1);
            const ba =
                bar * Math.PI -
                bar * 2 * Math.PI * (i > trlist.length / 2 ? 1 : 0);

            const brlist = generateFractalTree06(
                prng,
                txpolylinelists,
                twpolylinelists,
                trlist[i].x + xOffset,
                trlist[i].y + yOffset,
                depth - 1,
                height * prng.random(0.7, 0.9),
                strokeWidth * 0.6,
                angle + ba,
                0.55
            );

            for (let j = 0; j < brlist.length; j++) {
                if (prng.random() < 0.03) {
                    twpolylinelists.push(
                        generateTwig(
                            prng,
                            brlist[j].x + trlist[i].x + xOffset,
                            brlist[j].y + trlist[i].y + yOffset,
                            2,
                            ba * prng.random(0.75, 1.25),
                            0.3,
                            ba > 0 ? 1 : -1,
                            1,
                            [false, 0]
                        )
                    );
                }
            }

            trmlist = trmlist.concat(
                brlist.map(function (v) {
                    return new Point(v.x + trlist[i].x, v.y + trlist[i].y);
                })
            );
        } else {
            trmlist.push(trlist[i]);
        }
    }

    return trmlist;
}

/**
 * Generates a tree structure using fractal patterns.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=100] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree structure.
 */
export function generateTree06(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 100
): SvgPolyline[] {
    const strokeWidth: number = 6;
    const col: string = "rgba(100,100,100,0.5)";
    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const trmlist = generateFractalTree06(
        prng,
        txpolylinelists,
        twpolylinelists,
        x,
        y,
        3,
        height,
        strokeWidth,
        -Math.PI / 2,
        0
    );

    polylineArray.push([createPolyline(trmlist, x, y, "white", col, 0)]);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    const color = `rgba(100,100,100,${prng.random(0.4, 0.5).toFixed(3)})`;
    polylineArray.push([
        stroke(
            prng,
            trmlist.map(function (v) {
                return new Point(v.x + x, v.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (_) => Math.sin(1)
        ),
    ]);

    polylineArray.push(txpolylinelists.flat());
    polylineArray.push(twpolylinelists.flat());
    return polylineArray.flat();
}

/**
 * Generates a tree structure with a specific pattern.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate offset.
 * @param {number} y - Y-coordinate offset.
 * @param {number} [height=60] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree structure.
 */
export function generateTree07(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 60
): SvgPolyline[] {
    const strokeWidth: number = 4;
    const bendingAngle: (x: number) => number = (x: number) =>
        0.2 * Math.sqrt(x);
    const col: string = "rgba(100,100,100,1)";

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
        nslist.push([
            Noise.noise(prng, i * 0.5),
            Noise.noise(prng, i * 0.5, 0.5),
        ]);
    }

    // assert(col.includes('rgba('))
    if (!col.includes("rgba(")) {
        console.log("unexpected exception!!");
    }

    const polylines: SvgPolyline[] = [];
    const line1: Point[] = [];
    const line2: Point[] = [];
    let T: Point[][] = [];
    for (let i = 0; i < reso; i++) {
        const newX = x + bendingAngle(i / reso) * 100;
        const newY = y - (i * height) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < 1; j++) {
                const bfunc = function (x: number) {
                    return x <= 1
                        ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                        : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
                };
                const bpl = generateBlobPoints(
                    prng,
                    newX + prng.random(-0.3, 0.3) * strokeWidth * (reso - i),
                    newY + prng.random(-0.25, 0.25) * strokeWidth,
                    prng.random(0, -Math.PI / 6),
                    prng.random(20, 70),
                    prng.random(12, 24),
                    0.5,
                    bfunc
                );

                //canv+=createPolyline(bpl,{fill:col,strokeWidth:0})
                T = T.concat(triangulate(bpl as Point[], 50, true, false));
            }
        }
        line1.push(
            new Point(
                newX + (nslist[i][0] - 0.5) * strokeWidth - strokeWidth / 2,
                newY
            )
        );
        line2.push(
            new Point(
                newX + (nslist[i][1] - 0.5) * strokeWidth + strokeWidth / 2,
                newY
            )
        );
    }

    //canv += createPolyline(line1.concat(line2.reverse()),{fill:col,strokeWidth:0})
    T = triangulate(line1.concat(line2.reverse()), 50, true, true).concat(T);

    for (let k = 0; k < T.length; k++) {
        const m = midPoint(T[k]);
        const c = (Noise.noise(prng, m.x * 0.02, m.y * 0.02) * 200 + 50) | 0;
        const co = `rgba(${c},${c},${c},0.8)`;
        polylines.push(createPolyline(T[k], 0, 0, co, co));
    }
    return polylines;
}

/**
 * Recursive function to generate a fractal tree-like structure.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - X-coordinate offset.
 * @param {number} yOffset - Y-coordinate offset.
 * @param {number} depth - Current depth of recursion.
 * @param {number} [angle=-Math.PI/2] - Initial angle of the tree.
 * @param {number} [len=15] - Length of the branches.
 * @param {number} [bendingAngle=0] - Bending angle of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
function generateFractalTree08(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    depth: number,
    angle: number = -Math.PI / 2,
    len: number = 15,
    bendingAngle: number = 0
): SvgPolyline[] {
    const fun = (x: number) => (depth ? 1 : Math.cos(0.5 * Math.PI * x));
    const spt = new Vector(xOffset, yOffset);
    const ept = new Point(
        xOffset + Math.cos(angle) * len,
        yOffset + Math.sin(angle) * len
    );

    const _trmlist = [
        new Point(xOffset, yOffset),
        new Point(xOffset + len, yOffset),
    ];

    const bfun = prng.randomChoice([
        (x: number) => Math.sin(x * Math.PI),
        (x: number) => -Math.sin(x * Math.PI),
    ]);

    const trmlist = div(_trmlist, 10);

    for (let i = 0; i < trmlist.length; i++) {
        trmlist[i].y += bfun(i / trmlist.length) * 2;
    }

    for (let i = 0; i < trmlist.length; i++) {
        const d = distance(trmlist[i], spt.moveFrom(Point.O));
        const a = Math.atan2(trmlist[i].y - spt.y, trmlist[i].x - spt.x);
        trmlist[i].x = spt.x + d * Math.cos(a + angle);
        trmlist[i].y = spt.y + d * Math.sin(a + angle);
    }

    const polylineArray: SvgPolyline[][] = [];
    polylineArray.push([
        stroke(
            prng,
            trmlist,
            "rgba(100,100,100,0.5)",
            "rgba(100,100,100,0.5)",
            0.8,
            0.5,
            1,
            fun
        ),
    ]);

    if (depth !== 0) {
        const nben =
            bendingAngle +
            prng.randomChoice([-1, 1]) * Math.PI * 0.001 * depth * depth;
        if (prng.random() < 0.5) {
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, 0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle +
                        bendingAngle +
                        Math.PI *
                            prng.randomChoice([
                                prng.normalizedRandom(-1, -0.5),
                                prng.normalizedRandom(0.5, 1),
                            ]) *
                            0.2,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
        } else {
            polylineArray.push(
                generateFractalTree08(
                    prng,
                    ept.x,
                    ept.y,
                    depth - 1,
                    angle + bendingAngle,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
        }
    }
    return polylineArray.flat();
}

/**
 * Generates a tree-like structure with fractal branches.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} x - X-coordinate of the base point.
 * @param {number} y - Y-coordinate of the base point.
 * @param {number} [height=80] - Height of the tree.
 * @returns {SvgPolyline[]} An array of polylines representing the tree-like structure.
 */
export function generateTree08(
    prng: PRNG,
    x: number,
    y: number,
    height: number = 80
): SvgPolyline[] {
    const strokeWidth: number = 1;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    // Generate a random angle to add variety to the tree structure
    const angle = prng.normalizedRandom(-1, 1) * Math.PI * 0.2;

    // Generate the main trunk of the tree
    const _trlist = generateBranch(
        prng,
        height,
        strokeWidth,
        -Math.PI / 2 + angle,
        Math.PI * 0.2,
        height / 20
    );
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    // Iterate over each point in the trunk
    for (let i = 0; i < trlist.length; i++) {
        // Randomly generate branches
        if (prng.random() < 0.2) {
            twpolylinelists.push(
                generateFractalTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    Math.floor(prng.random(0, 4)),
                    -Math.PI / 2 + prng.random(-angle, 0)
                )
            );
        } else if (i === Math.floor(trlist.length / 2)) {
            // Generate a specific branch at the middle of the trunk
            twpolylinelists.push(
                generateFractalTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    3,
                    -Math.PI / 2 + angle
                )
            );
        }
    }

    // Add the main trunk to the polyline array
    polylineArray.push([createPolyline(trlist, x, y, "white", col)]);

    // Add a colored stroke to the main trunk
    const color = `rgba(100,100,100,${prng.random(0.6, 0.7).toFixed(3)})`;
    polylineArray.push([
        stroke(
            prng,
            trlist.map(function (v) {
                return new Point(v.x + x, v.y + y);
            }),
            color,
            color,
            2.5,
            0.9,
            0,
            (x) => Math.sin(1)
        ),
    ]);

    // Add the generated fractal branches to the polyline array
    polylineArray.push(twpolylinelists.flat());

    // Return the flattened array of polylines
    return polylineArray.flat();
}
