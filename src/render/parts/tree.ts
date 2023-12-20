import { Noise } from "../basic/perlinNoise";
import { distance, Point, Vector } from "../basic/point";
import { PRNG } from "../basic/PRNG";
import { loopNoise } from "../basic/utils";
import { createPolyline } from "../svg/createPolyline";
import { midPoint, triangulate } from "../basic/polytools";
import { SvgPolyline } from "../svg/types";
import { blob_points, blob, div, stroke } from "./brushes";

export function tree01(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 50,
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
        const newY = y - (i * hei) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < (reso - i) / 5; j++) {
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(1)})`;
                polylines.push(
                    blob(
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

export function tree02(
    prng: PRNG,
    x: number,
    y: number,
    col: string = "rgba(100,100,100,0.5)",
    clu: number = 5
): SvgPolyline[] {
    const hei: number = 16,
        strokeWidth: number = 8;

    const polylines: SvgPolyline[] = [];
    const bfunc = (x: number) =>
        x <= 1
            ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
            : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
    for (let i = 0; i < clu; i++) {
        polylines.push(
            blob(
                prng,
                x + prng.gaussianRandom() * clu * 4,
                y + prng.gaussianRandom() * clu * 4,
                Math.PI / 2,
                col,
                prng.random(0.5, 1.25) * hei,
                prng.random(0.5, 1.25) * strokeWidth,
                0.5,
                bfunc
            )
        );
    }
    return polylines;
}

export function tree03(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 16,
    col: string = "rgba(100,100,100,0.5)",
    ben: (x: number) => number = (_) => 0
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
        const newX = x + ben(i / reso) * 100;
        const newY = y - (i * hei) / reso;
        if (i >= reso / 5) {
            for (let j = 0; j < (reso - i) * 2; j++) {
                const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
                const ox =
                    prng.random(0, 2) * strokeWidth * shape((reso - i) / reso);
                const lcol = `rgba(${leafcol[0]},${leafcol[1]},${leafcol[2]},${(
                    prng.random(0, 0.2) + parseFloat(leafcol[3])
                ).toFixed(3)})`;
                blobs.push(
                    blob(
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

export function branch(
    prng: PRNG,
    hei: number = 360,
    strokeWidth: number = 6,
    ang: number = 0,
    ben: number = 0.2 * Math.PI,
    det: number = 10
): Point[][] {
    let newX = 0;
    let newY = 0;
    const tlist = [[newX, newY]];
    let a0 = 0;
    const g = 3;
    for (let i = 0; i < g; i++) {
        a0 += ((prng.random(1, 2) * ben) / 2) * prng.randomSign();
        newX += (Math.cos(a0) * hei) / g;
        newY -= (Math.sin(a0) * hei) / g;
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
        tlist[i][0] = d * Math.cos(a - ta + ang);
        tlist[i][1] = d * Math.sin(a - ta + ang);
    }

    const trlist1: Point[] = [];
    const trlist2: Point[] = [];
    const span = det;
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
            ((Noise.noise(prng, i * 0.3) - 0.5) * strokeWidth * hei) / 80;

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

export function twig(
    prng: PRNG,
    tx: number,
    ty: number,
    dep: number,
    ang: number = 0,
    sca: number = 1,
    dir: number = 1,
    strokeWidth: number = 1,
    lea: [boolean, number] = [true, 12]
): SvgPolyline[] {
    const polylineArray: SvgPolyline[][] = [];
    const twlist: Point[] = [];
    const tl = 10;
    const hs = prng.random(0.5, 1);
    // const fun1 = (x: number) => Math.sqrt(x);
    const fun2 = (x: number) => -1 / Math.pow(x / tl + 1, 5) + 1;

    const tfun = prng.randomChoice([fun2]);
    const a0 = ((prng.random() * Math.PI) / 6) * dir + ang;

    for (let i = 0; i < tl; i++) {
        const mx = dir * tfun(i / tl) * 50 * sca * hs;
        const my = -i * 5 * sca;

        const a = Math.atan2(my, mx);
        const d = Math.pow(mx * mx + my * my, 0.5);

        const newX = Math.cos(a + a0) * d;
        const newY = Math.sin(a + a0) * d;

        twlist.push(new Point(newX + tx, newY + ty));
        if ((i === ((tl / 3) | 0) || i === (((tl * 2) / 3) | 0)) && dep > 0) {
            polylineArray.push(
                twig(
                    prng,
                    newX + tx,
                    newY + ty,
                    dep - 1,
                    ang,
                    sca * 0.8,
                    dir * prng.randomChoice([-1, 1]),
                    strokeWidth,
                    lea
                )
            );
        }
        if (i === tl - 1 && lea[0]) {
            for (let j = 0; j < 5; j++) {
                const dj = (j - 2.5) * 5;
                const bfunc = function (x: number) {
                    return x <= 1
                        ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                        : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
                };
                polylineArray.push([
                    blob(
                        prng,
                        newX + tx + Math.cos(ang) * dj * strokeWidth,
                        newY +
                            ty +
                            (Math.sin(ang) * dj - lea[1] / (dep + 1)) *
                                strokeWidth,
                        ang / 2 +
                            Math.PI / 2 +
                            Math.PI * prng.random(-0.1, 0.1),
                        `rgba(100,100,100,${(0.5 + dep * 0.2).toFixed(3)})`,
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

function bark(
    prng: PRNG,
    x: number,
    y: number,
    strokeWidth: number,
    ang: number
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

    nslist = loopNoise(nslist);
    const brklist: Point[] = [];
    for (let i = 0; i < lalist.length; i++) {
        const ns = nslist[i] * noi + (1 - noi);
        const newX = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
        const newY = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
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

export function barkify(
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
                blob(
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
                bark(
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
                    blob(
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

export function tree04(prng: PRNG, x: number, y: number): SvgPolyline[] {
    const hei: number = 300;
    const strokeWidth: number = 6;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const _trlist = branch(prng, hei, strokeWidth, -Math.PI / 2);
    txpolylinelists.push(barkify(prng, x, y, _trlist));
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
            const _brlist: Point[][] = branch(
                prng,
                hei * prng.random(0.3, 0.6),
                strokeWidth * 0.5,
                ba
            );

            _brlist[0].splice(0, 1);
            _brlist[1].splice(0, 1);
            const foff = function (p: Point) {
                return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
            };

            txpolylinelists.push(
                barkify(prng, x, y, [
                    _brlist[0].map(foff),
                    _brlist[1].map(foff),
                ])
            );

            for (let j = 0; j < _brlist[0].length; j++) {
                if (prng.random() < 0.2 || j === _brlist[0].length - 1) {
                    twpolylinelists.push(
                        twig(
                            prng,
                            _brlist[0][j].x + trlist[i].x + x,
                            _brlist[0][j].y + trlist[i].y + y,
                            1,
                            ba > -Math.PI / 2 ? ba : ba + Math.PI,
                            (0.5 * hei) / 300,
                            ba > -Math.PI / 2 ? 1 : -1,
                            hei / 300
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
 * 近处的大树
 * @param x
 * @param y
 * @param args
 * @returns
 */
export function tree05(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 300
): SvgPolyline[] {
    const strokeWidth: number = 5;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const _trlist = branch(prng, hei, strokeWidth, -Math.PI / 2, 0);
    txpolylinelists.push(barkify(prng, x, y, _trlist));
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
            const _brlist = branch(
                prng,
                hei * (0.3 * p - prng.random(0, 0.05)),
                strokeWidth * 0.5,
                ba,
                0.5
            );

            _brlist[0].splice(0, 1);
            _brlist[1].splice(0, 1);
            // const foff = function (p: Point) {
            //   return new Point(p.x + trlist[i].x, p.y + trlist[i].y);
            // };
            //txcanv += barkify(x,y,[brlist[0].map(foff),brlist[1].map(foff)])

            for (let j = 0; j < _brlist[0].length; j++) {
                if (j % 20 === 0 || j === _brlist[0].length - 1) {
                    twpolylinelists.push(
                        twig(
                            prng,
                            _brlist[0][j].x + trlist[i].x + x,
                            _brlist[0][j].y + trlist[i].y + y,
                            0,
                            ba > -Math.PI / 2 ? ba : ba + Math.PI,
                            (0.2 * hei) / 300,
                            ba > -Math.PI / 2 ? 1 : -1,
                            hei / 300,
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

    // 树干
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

function fracTree06(
    prng: PRNG,
    txpolylinelists: SvgPolyline[][],
    twpolylinelists: SvgPolyline[][],
    xoff: number,
    yoff: number,
    dep: number,
    hei: number = 300,
    strokeWidth: number = 5,
    ang: number = 0,
    ben: number = 0.2 * Math.PI
): Point[] {
    const _trlist = branch(prng, hei, strokeWidth, ang, ben, hei / 20);

    txpolylinelists.push(barkify(prng, xoff, yoff, _trlist));
    const trlist = _trlist[0].concat(_trlist[1].reverse());

    let trmlist: Point[] = [];

    for (let i = 0; i < trlist.length; i++) {
        // const p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
        if (
            ((prng.random() < 0.025 &&
                i >= trlist.length * 0.2 &&
                i <= trlist.length * 0.8) ||
                i === ((trlist.length / 2) | 0) - 1 ||
                i === ((trlist.length / 2) | 0) + 1) &&
            dep > 0
        ) {
            const bar = prng.random(0.02, 0.1);
            const ba =
                bar * Math.PI -
                bar * 2 * Math.PI * (i > trlist.length / 2 ? 1 : 0);

            const brlist = fracTree06(
                prng,
                txpolylinelists,
                twpolylinelists,
                trlist[i].x + xoff,
                trlist[i].y + yoff,
                dep - 1,
                hei * prng.random(0.7, 0.9),
                strokeWidth * 0.6,
                ang + ba,
                0.55
            );

            for (let j = 0; j < brlist.length; j++) {
                if (prng.random() < 0.03) {
                    twpolylinelists.push(
                        twig(
                            prng,
                            brlist[j].x + trlist[i].x + xoff,
                            brlist[j].y + trlist[i].y + yoff,
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

export function tree06(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 100
): SvgPolyline[] {
    const strokeWidth: number = 6;
    const col: string = "rgba(100,100,100,0.5)";
    const polylineArray: SvgPolyline[][] = [];
    const txpolylinelists: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const trmlist = fracTree06(
        prng,
        txpolylinelists,
        twpolylinelists,
        x,
        y,
        3,
        hei,
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

export function tree07(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 60
): SvgPolyline[] {
    const strokeWidth: number = 4;
    const ben: (x: number) => number = (x: number) => 0.2 * Math.sqrt(x);
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
        const newX = x + ben(i / reso) * 100;
        const newY = y - (i * hei) / reso;
        if (i >= reso / 4) {
            for (let j = 0; j < 1; j++) {
                const bfunc = function (x: number) {
                    return x <= 1
                        ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                        : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
                };
                const bpl = blob_points(
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

function fracTree08(
    prng: PRNG,
    xoff: number,
    yoff: number,
    dep: number,
    ang: number = -Math.PI / 2,
    len: number = 15,
    ben: number = 0
): SvgPolyline[] {
    const fun = (x: number) => (dep ? 1 : Math.cos(0.5 * Math.PI * x));
    const spt = new Vector(xoff, yoff);
    const ept = new Point(
        xoff + Math.cos(ang) * len,
        yoff + Math.sin(ang) * len
    );

    const _trmlist = [new Point(xoff, yoff), new Point(xoff + len, yoff)];

    const bfun = prng.randomChoice([
        (x: number) => Math.sin(x * Math.PI),
        (x: number) => -Math.sin(x * Math.PI),
    ]);

    const trmlist = div(_trmlist, 10);

    for (let i = 0; i < trmlist.length; i++) {
        trmlist[i].y += bfun(i / trmlist.length) * 2;
    }

    for (let i = 0; i < trmlist.length; i++) {
        const d = distance(trmlist[i], spt.movefrom(Point.O));
        const a = Math.atan2(trmlist[i].y - spt.y, trmlist[i].x - spt.x);
        trmlist[i].x = spt.x + d * Math.cos(a + ang);
        trmlist[i].y = spt.y + d * Math.sin(a + ang);
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

    if (dep !== 0) {
        const nben =
            ben + prng.randomChoice([-1, 1]) * Math.PI * 0.001 * dep * dep;
        if (prng.random() < 0.5) {
            polylineArray.push(
                fracTree08(
                    prng,
                    ept.x,
                    ept.y,
                    dep - 1,
                    ang +
                        ben +
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
                fracTree08(
                    prng,
                    ept.x,
                    ept.y,
                    dep - 1,
                    ang +
                        ben +
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
                fracTree08(
                    prng,
                    ept.x,
                    ept.y,
                    dep - 1,
                    ang + ben,
                    len * prng.normalizedRandom(0.8, 0.9),
                    nben
                )
            );
        }
    }
    return polylineArray.flat();
}

export function tree08(
    prng: PRNG,
    x: number,
    y: number,
    hei: number = 80
): SvgPolyline[] {
    const strokeWidth: number = 1;
    const col: string = "rgba(100,100,100,0.5)";

    const polylineArray: SvgPolyline[][] = [];
    const twpolylinelists: SvgPolyline[][] = [];

    const ang = prng.normalizedRandom(-1, 1) * Math.PI * 0.2;

    const _trlist = branch(
        prng,
        hei,
        strokeWidth,
        -Math.PI / 2 + ang,
        Math.PI * 0.2,
        hei / 20
    );
    //txcanv += barkify(x,y,trlist)

    const trlist = _trlist[0].concat(_trlist[1].reverse());

    for (let i = 0; i < trlist.length; i++) {
        if (prng.random() < 0.2) {
            twpolylinelists.push(
                fracTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    Math.floor(prng.random(0, 4)),
                    -Math.PI / 2 + prng.random(-ang, 0)
                )
            );
        } else if (i === Math.floor(trlist.length / 2)) {
            twpolylinelists.push(
                fracTree08(
                    prng,
                    x + trlist[i].x,
                    y + trlist[i].y,
                    3,
                    -Math.PI / 2 + ang
                )
            );
        }
    }

    polylineArray.push([createPolyline(trlist, x, y, "white", col)]);

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

    polylineArray.push(twpolylinelists.flat());

    return polylineArray.flat();
}
