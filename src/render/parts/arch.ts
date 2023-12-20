import { Chunk } from "../basic/chunk";
import { Noise } from "../basic/perlinNoise";
import { Point } from "../basic/point";
import { PRNG } from "../basic/PRNG";
import { createPolyline } from "../svg/createPolyline";
import { midPoint } from "../basic/polytools";
import { ISvgElement } from "../svg";
import { SvgPolyline, SvgText } from "../svg/types";
import { div, stroke, generateTexture } from "./brushes";
import { generateHat02, generateMan, generateStick } from "./man";

function flip(ptlist: Point[], axis: number = 0): Point[] {
    ptlist.forEach((i) => {
        i.x = axis - i.x - axis;
    });
    return ptlist;
}

/**
 * Generates a hut using procedural generation.
 *
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number} xOffset - The x-coordinate offset for the hut.
 * @param {number} yOffset - The y-coordinate offset for the hut.
 * @param {number} [height=40] - The height of the hut.
 * @param {number} [width=180] - The width of the hut.
 * @param {number} [textureCount=300] - The number of textures in the hut.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the hut.
 */
function generateHut(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 40,
    width: number = 180,
    textureCount: number = 300
): SvgPolyline[] {
    const resolution = [10, 10];
    const pointList: Point[][] = [];

    for (let i = 0; i < resolution[0]; i++) {
        pointList.push([]);
        const currentHeight = height * prng.random(1, 1.2);
        for (let j = 0; j < resolution[1]; j++) {
            const newX =
                width *
                (i / (resolution[0] - 1) - 0.5) *
                Math.pow(j / (resolution[1] - 1), 0.7);
            const newY = currentHeight * (j / (resolution[1] - 1));
            pointList[pointList.length - 1].push(new Point(newX, newY));
        }
    }

    const polylines: SvgPolyline[] = [];

    polylines.push(
        createPolyline(
            pointList[0]
                .slice(0, -1)
                .concat(pointList[pointList.length - 1].slice(0, -1).reverse()),
            xOffset,
            yOffset,
            "white",
            "none"
        )
    );
    polylines.push(
        createPolyline(
            pointList[0],
            xOffset,
            yOffset,
            "none",
            "rgba(100,100,100,0.3)",
            2
        )
    );
    polylines.push(
        createPolyline(
            pointList[pointList.length - 1],
            xOffset,
            yOffset,
            "none",
            "rgba(100,100,100,0.3)",
            2
        )
    );

    const textures = generateTexture(
        prng,
        pointList,
        xOffset,
        yOffset,
        textureCount,
        2,
        () => prng.weightedRandom((a) => a * a),
        (x) => 5,
        0.25
    );

    return polylines.concat(textures);
}

/**
 * Generates a box using procedural generation.
 *
 * @param {PRNG} prng - The pseudorandom number generator.
 * @param {number} xOffset - The x-coordinate offset for the box.
 * @param {number} yOffset - The y-coordinate offset for the box.
 * @param {number} [height=20] - The height of the box.
 * @param {number} [width=120] - The width of the box.
 * @param {number} [rotation=0.7] - The rotation factor of the box.
 * @param {number} [perturbation=4] - The perturbation factor of the box.
 * @param {boolean} [hasTransparency=true] - Indicates whether the box has transparency.
 * @param {boolean} [hasBottom=true] - Indicates whether the box has a bottom.
 * @param {number} [strokeWidth=3] - The stroke width of the box.
 * @param {(upperLeftPoint: Point, upperRightPoint: Point, bottomLeftPoint: Point, bottomRightPoint: Point) => Point[][]} [decorator=() => []] - The decorator function for additional features.
 * @returns {SvgPolyline[]} An array of SvgPolyline representing the box.
 */
function generateBox(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    rotation: number = 0.7,
    perturbation: number = 4,
    hasTransparency: boolean = true,
    hasBottom: boolean = true,
    strokeWidth: number = 3,
    decorator: (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) => Point[][] = (_1, _2, _3, _4) => []
): SvgPolyline[] {
    const mid = -width * 0.5 + width * rotation;
    const bmid = -width * 0.5 + width * (1 - rotation);
    const pointList: Point[][] = [];
    pointList.push(
        div([new Point(-width * 0.5, -height), new Point(-width * 0.5, 0)], 5)
    );
    pointList.push(
        div([new Point(width * 0.5, -height), new Point(width * 0.5, 0)], 5)
    );
    if (hasBottom) {
        pointList.push(
            div([new Point(-width * 0.5, 0), new Point(mid, perturbation)], 5)
        );
        pointList.push(
            div([new Point(width * 0.5, 0), new Point(mid, perturbation)], 5)
        );
    }
    pointList.push(
        div([new Point(mid, -height), new Point(mid, perturbation)], 5)
    );
    if (hasTransparency) {
        if (hasBottom) {
            pointList.push(
                div(
                    [
                        new Point(-width * 0.5, 0),
                        new Point(bmid, -perturbation),
                    ],
                    5
                )
            );
            pointList.push(
                div(
                    [new Point(width * 0.5, 0), new Point(bmid, -perturbation)],
                    5
                )
            );
        }
        pointList.push(
            div([new Point(bmid, -height), new Point(bmid, -perturbation)], 5)
        );
    }

    const surface = (rotation < 0.5 ? 1 : 0) * 2 - 1;
    const extendedPointList = pointList.concat(
        decorator(
            new Point(surface * width * 0.5, -height),
            new Point(mid, -height + perturbation),
            new Point(surface * width * 0.5, 0),
            new Point(mid, perturbation)
        )
    );

    const polylineList: SvgPolyline[] = [];
    if (!hasTransparency) {
        polylineList.push(
            createPolyline(
                [
                    new Point(width * 0.5, -height),
                    new Point(width * 0.5, -height),
                    new Point(width * 0.5, 0),
                    new Point(mid, perturbation),
                    new Point(-width * 0.5, 0),
                ],
                xOffset,
                yOffset,
                "white",
                "none"
            )
        );
    }

    for (let i = 0; i < extendedPointList.length; i++) {
        polylineList.push(
            stroke(
                prng,
                extendedPointList[i].map(function (p) {
                    return new Point(p.x + xOffset, p.y + yOffset);
                }),
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                strokeWidth,
                1,
                1,
                (x) => 1
            )
        );
    }
    return polylineList;
}

/**
 * Generates decorative elements based on the specified style.
 *
 * @param {number} style - The style of decoration to generate.
 * @param {Point} [upperLeftPoint=Point.O] - The upper-left point of the bounding box.
 * @param {Point} [upperRightPoint=new Point(0, 100)] - The upper-right point of the bounding box.
 * @param {Point} [bottomLeftPoint=new Point(100, 0)] - The lower-left point of the bounding box.
 * @param {Point} [bottomRightPoint=new Point(100, 100)] - The lower-right point of the bounding box.
 * @param {number[]} [hsp=[1, 3]] - The horizontal subdivision parameters.
 * @param {number[]} [vsp=[1, 2]] - The vertical subdivision parameters.
 * @returns {Point[][]} An array of points representing the decorative elements.
 */
function generateDeco(
    style: number,
    upperLeftPoint: Point = Point.O,
    upperRightPoint: Point = new Point(0, 100),
    bottomLeftPoint: Point = new Point(100, 0),
    bottomRightPoint: Point = new Point(100, 100),
    hsp: number[] = [1, 3],
    vsp: number[] = [1, 2]
): Point[][] {
    const plist: Point[][] = [];
    const dl = div([upperLeftPoint, bottomLeftPoint], vsp[1]);
    const dr = div([upperRightPoint, bottomRightPoint], vsp[1]);
    const du = div([upperLeftPoint, upperRightPoint], hsp[1]);
    const dd = div([bottomLeftPoint, bottomRightPoint], hsp[1]);

    if (style === 1) {
        // -| |-
        const mlu = du[hsp[0]];
        const mru = du[du.length - 1 - hsp[0]];
        const mld = dd[hsp[0]];
        const mrd = dd[du.length - 1 - hsp[0]];

        for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
            const mml = div([mlu, mld], vsp[1])[i];
            const mmr = div([mru, mrd], vsp[1])[i];
            const ml = dl[i];
            const mr = dr[i];
            plist.push(div([mml, ml], 5));
            plist.push(div([mmr, mr], 5));
        }
        plist.push(div([mlu, mld], 5));
        plist.push(div([mru, mrd], 5));
    } else if (style === 2) {
        // ||||
        for (let i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
            const mu = du[i];
            const md = dd[i];
            plist.push(div([mu, md], 5));
        }
    } else if (style === 3) {
        // |##|
        const mlu = du[hsp[0]];
        const mru = du[du.length - 1 - hsp[0]];
        const mld = dd[hsp[0]];
        const mrd = dd[du.length - 1 - hsp[0]];

        for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
            const mml = div([mlu, mld], vsp[1])[i];
            const mmr = div([mru, mrd], vsp[1])[i];
            const mmu = div([mlu, mru], vsp[1])[i];
            const mmd = div([mld, mrd], vsp[1])[i];

            plist.push(div([mml, mmr], 5));
            plist.push(div([mmu, mmd], 5));
        }
        plist.push(div([mlu, mld], 5));
        plist.push(div([mru, mrd], 5));
    }
    return plist;
}

/**
 * Generates Rail SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [seed=0] - The seed for randomization.
 * @param {boolean} [hasTrack=true] - Indicates whether to generate track segments.
 * @param {number} [height=20] - The height of the rail.
 * @param {number} [width=180] - The width of the rail.
 * @param {number} [perturbation=4] - The perturbation parameter for rail generation.
 * @param {number} [segments=4] - The number of segments in the rail.
 * @param {boolean} [hasFront=true] - Indicates whether to generate front rail segments.
 * @param {number} [rotation=0.7] - The rotation parameter for rail.
 * @param {number} [strokeWidth=1] - The stroke width of the rail.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing the rail.
 */
function generateRail(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    hasTrack: boolean = true,
    height: number = 20,
    width: number = 180,
    perturbation: number = 4,
    segments: number = 4,
    hasFront: boolean = true,
    rotation: number = 0.7,
    strokeWidth: number = 1
): SvgPolyline[] {
    const mid = -width * 0.5 + width * rotation;
    const bmid = -width * 0.5 + width * (1 - rotation);
    const ptlist: Point[][] = [];

    if (hasFront) {
        ptlist.push(
            div(
                [new Point(-width * 0.5, 0), new Point(mid, perturbation)],
                segments
            )
        );
        ptlist.push(
            div(
                [new Point(mid, perturbation), new Point(width * 0.5, 0)],
                segments
            )
        );
    }

    if (hasTrack) {
        ptlist.push(
            div(
                [new Point(-width * 0.5, 0), new Point(bmid, -perturbation)],
                segments
            )
        );
        ptlist.push(
            div(
                [new Point(bmid, -perturbation), new Point(width * 0.5, 0)],
                segments
            )
        );
    }

    if (hasFront) {
        ptlist.push(
            div(
                [
                    new Point(-width * 0.5, -height),
                    new Point(mid, -height + perturbation),
                ],
                segments
            )
        );
        ptlist.push(
            div(
                [
                    new Point(mid, -height + perturbation),
                    new Point(width * 0.5, -height),
                ],
                segments
            )
        );
    }

    if (hasTrack) {
        ptlist.push(
            div(
                [
                    new Point(-width * 0.5, -height),
                    new Point(bmid, -height - perturbation),
                ],
                segments
            )
        );
        ptlist.push(
            div(
                [
                    new Point(bmid, -height - perturbation),
                    new Point(width * 0.5, -height),
                ],
                segments
            )
        );
    }

    if (hasTrack) {
        const open = Math.floor(prng.random(0, ptlist.length));
        ptlist[open] = ptlist[open].slice(0, -1);
        ptlist[(open + ptlist.length) % ptlist.length] = ptlist[
            (open + ptlist.length) % ptlist.length
        ].slice(0, -1);
    }

    const polylines: SvgPolyline[] = [];

    for (let i = 0; i < ptlist.length / 2; i++) {
        for (let j = 0; j < ptlist[i].length; j++) {
            ptlist[i][j].y +=
                (Noise.noise(prng, i, j * 0.5, seed) - 0.5) * height;
            ptlist[(ptlist.length / 2 + i) % ptlist.length][
                j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length
            ].y += (Noise.noise(prng, i + 0.5, j * 0.5, seed) - 0.5) * height;
            const ln = div(
                [
                    ptlist[i][j],
                    ptlist[(ptlist.length / 2 + i) % ptlist.length][
                        j %
                            ptlist[(ptlist.length / 2 + i) % ptlist.length]
                                .length
                    ],
                ],
                2
            );
            ln[0].x += prng.random(-0.25, 0.25) * height;
            polylines.push(
                createPolyline(
                    ln,
                    xOffset,
                    yOffset,
                    "none",
                    "rgba(100,100,100,0.5)",
                    2
                )
            );
        }
    }

    for (let i = 0; i < ptlist.length; i++) {
        polylines.push(
            stroke(
                prng,
                ptlist[i].map((p) => new Point(p.x + xOffset, p.y + yOffset)),
                "rgba(100,100,100,0.5)",
                "rgba(100,100,100,0.5)",
                strokeWidth,
                0.5,
                1,
                (_) => 1
            )
        );
    }

    return polylines;
}

/**
 * Generates Roof SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [height=20] - The height of the Roof.
 * @param {number} [width=120] - The width of the Roof.
 * @param {number} [rotation=0.7] - The rotation parameter for Roof.
 * @param {number} [strokeWidth=3] - The stroke width of the Roof.
 * @param {number} [perturbation=4] - The perturbation parameter for Roof generation.
 * @param {[number, string]} [pla=[0, ""]] - An array indicating whether to place additional text on the Roof.
 * @param {number} [cor=5] - The cor parameter for Roof generation.
 * @returns {ISvgElement[]} An array of SVG elements representing Roof.
 */
function generateRoof(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    rotation: number = 0.7,
    strokeWidth: number = 3,
    perturbation: number = 4,
    pla: [number, string] = [0, ""],
    cor: number = 5
): ISvgElement[] {
    const opf = function (ptlist: Point[]) {
        if (rotation < 0.5) {
            return flip(ptlist);
        } else {
            return ptlist;
        }
    };
    const rrot = rotation < 0.5 ? 1 - rotation : rotation;

    const mid = -width * 0.5 + width * rrot;
    const quat = (mid + width * 0.5) * 0.5 - mid;

    const ptlist = [];
    ptlist.push(
        div(
            opf([
                new Point(-width * 0.5 + quat, -height - perturbation / 2),
                new Point(
                    -width * 0.5 + quat * 0.5,
                    -height / 2 - perturbation / 4
                ),
                new Point(-width * 0.5 - cor, 0),
            ]),
            5
        )
    );
    ptlist.push(
        div(
            opf([
                new Point(mid + quat, -height),
                new Point((mid + quat + width * 0.5) / 2, -height / 2),
                new Point(width * 0.5 + cor, 0),
            ]),
            5
        )
    );
    ptlist.push(
        div(
            opf([
                new Point(mid + quat, -height),
                new Point(mid + quat / 2, -height / 2 + perturbation / 2),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );

    ptlist.push(
        div(
            opf([
                new Point(-width * 0.5 - cor, 0),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );
    ptlist.push(
        div(
            opf([
                new Point(width * 0.5 + cor, 0),
                new Point(mid + cor, perturbation),
            ]),
            5
        )
    );

    ptlist.push(
        div(
            opf([
                new Point(-width * 0.5 + quat, -height - perturbation / 2),
                new Point(mid + quat, -height),
            ]),
            5
        )
    );

    const polylines: ISvgElement[] = [];

    const polist = opf([
        new Point(-width * 0.5, 0),
        new Point(-width * 0.5 + quat, -height - perturbation / 2),
        new Point(mid + quat, -height),
        new Point(width * 0.5, 0),
        new Point(mid, perturbation),
    ]);
    polylines.push(createPolyline(polist, xOffset, yOffset, "white", "none"));

    for (let i = 0; i < ptlist.length; i++) {
        polylines.push(
            stroke(
                prng,
                ptlist[i].map((p) => new Point(p.x + xOffset, p.y + yOffset)),
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                strokeWidth,
                1,
                1,
                (_) => 1
            )
        );
    }

    if (pla[0] === 1) {
        let pp = opf([
            new Point(mid + quat / 2, -height / 2 + perturbation / 2),
            new Point(
                -strokeWidth * 0.5 + quat * 0.5,
                -height / 2 - perturbation / 4
            ),
        ]);
        if (pp[0].x > pp[1].x) {
            pp = [pp[1], pp[0]];
        }
        const mp = midPoint(pp);
        const a = Math.atan2(pp[1].y - pp[0].y, pp[1].x - pp[0].x);
        const adeg = (a * 180) / Math.PI;

        const text = new SvgText(pla[1], {
            fontSize: height * 0.6,
            fontFamily: "Verdana",
            textAnchor: "middle",
            transform: `translate(${mp.x + xOffset},${
                mp.y + yOffset
            }) rotate(${adeg})`,
            style: {
                fill: "rgba(100, 100, 100, 0.9)",
            },
        });

        polylines.push(text);
    }

    return polylines;
}

/**
 * Generates Pagoda Roof SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [height=20] - The height of the Pagoda Roof.
 * @param {number} [width=120] - The width of the Pagoda Roof.
 * @param {number} [strokeWidth=3] - The stroke width of the Pagoda Roof.
 * @param {number} [perturbation=4] - The perturbation parameter for Pagoda Roof generation.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing Pagoda Roof.
 */
function generatePagodaRoof(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    height: number = 20,
    width: number = 120,
    strokeWidth: number = 3,
    perturbation: number = 4
): SvgPolyline[] {
    const cor = 10;
    const sid = 4;
    const ptlist: Point[][] = [];
    const polist: Point[] = [new Point(0, -height)];
    const polylines: SvgPolyline[] = [];

    for (let i = 0; i < sid; i++) {
        const fx = width * ((i * 1.0) / (sid - 1) - 0.5);
        const fy =
            perturbation * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
        const fxx = (width + cor) * ((i * 1.0) / (sid - 1) - 0.5);
        if (i > 0) {
            ptlist.push([ptlist[ptlist.length - 1][2], new Point(fxx, fy)]);
        }
        ptlist.push([
            new Point(0, -height),
            new Point(fx * 0.5, (-height + fy) * 0.5),
            new Point(fxx, fy),
        ]);
        polist.push(new Point(fxx, fy));
    }

    polylines.push(createPolyline(polist, xOffset, yOffset, "white", "none"));

    for (let i = 0; i < ptlist.length; i++) {
        polylines.push(
            stroke(
                prng,
                div(ptlist[i], 5).map(
                    (p) => new Point(p.x + xOffset, p.y + yOffset)
                ),
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                strokeWidth,
                1,
                1,
                (_) => 1
            )
        );
    }

    return polylines;
}

/**
 * Generates Arch01 SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [seed=0] - The seed for randomization.
 * @param {number} [height=70] - The height of the Arch01.
 * @param {number} [strokeWidth=180] - The stroke width of the Arch01.
 * @param {number} [perturbation=5] - A parameter for Arch01 generation.
 * @returns {SvgPolyline[]} An array of SVG polyline elements representing Arch01.
 */
export function generateArch01(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    seed: number = 0,
    height: number = 70,
    strokeWidth: number = 180,
    perturbation: number = 5
): SvgPolyline[] {
    const p = prng.random(0.4, 0.6);
    const h0 = height * p;
    const h1 = height * (1 - p);

    const polylineArray: SvgPolyline[][] = [];

    polylineArray.push(
        generateHut(prng, xOffset, yOffset - height, h0, strokeWidth)
    );

    polylineArray.push(
        generateBox(
            prng,
            xOffset,
            yOffset,
            h1,
            (strokeWidth * 2) / 3,
            0.7,
            perturbation,
            true,
            false
        )
    );

    polylineArray.push(
        generateRail(
            prng,
            xOffset,
            yOffset,
            seed,
            true,
            10,
            strokeWidth,
            perturbation * 2,
            prng.random(3, 6),
            false
        )
    );

    const mcnt = prng.randomChoice([0, 1, 1, 2]);
    if (mcnt === 1) {
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(-strokeWidth / 3, strokeWidth / 3),
                yOffset,
                prng.randomChoice([true, false]),
                0.42
            )
        );
    } else if (mcnt === 2) {
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(-strokeWidth / 4, -strokeWidth / 5),
                yOffset,
                false,
                0.42
            )
        );
        polylineArray.push(
            generateMan(
                prng,
                xOffset +
                    prng.normalizedRandom(strokeWidth / 5, strokeWidth / 4),
                yOffset,
                true,
                0.42
            )
        );
    }

    polylineArray.push(
        generateRail(
            prng,
            xOffset,
            yOffset,
            seed,
            false,
            10,
            strokeWidth,
            perturbation * 2,
            prng.random(3, 6),
            true
        )
    );

    return polylineArray.flat();
}

/**
 * Generates Arch02 SVG elements.
 *
 * @param {PRNG} prng - The pseudo-random number generator.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} yOffset - The y-coordinate offset.
 * @param {number} [strokeWidth=50] - The stroke width of the Arch02.
 * @param {number} [stories=3] - The number of stories in the Arch02.
 * @param {number} [rotation=0.3] - The rotation parameter for Arch02.
 * @param {number} [style=1] - The style parameter for Arch02.
 * @returns {ISvgElement[]} An array of SVG elements representing Arch02.
 */
export function generateArch02(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    strokeWidth: number = 50,
    stories: number = 3,
    rotation: number = 0.3,
    style: number = 1
): ISvgElement[] {
    const height = 10;
    const perturbation = 5;
    const hasRail = false;

    const elementlists: ISvgElement[][] = [];

    const dec = (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) =>
        generateDeco(
            style,
            upperLeftPoint,
            upperRightPoint,
            bottomLeftPoint,
            bottomRightPoint,
            [[], [1, 5], [1, 5], [1, 4]][style],
            [[], [1, 2], [1, 2], [1, 3]][style]
        );

    let hoff = 0;

    for (let i = 0; i < stories; i++) {
        elementlists.push(
            generateBox(
                prng,
                xOffset,
                yOffset - hoff,
                height,
                strokeWidth * Math.pow(0.85, i),
                rotation,
                perturbation,
                false,
                true,
                1.5,
                dec
            )
        );

        elementlists.push(
            hasRail
                ? generateRail(
                      prng,
                      xOffset,
                      yOffset - hoff,
                      i * 0.2,
                      false,
                      height / 2,
                      strokeWidth * Math.pow(0.85, i) * 1.1,
                      perturbation,
                      4,
                      true,
                      rotation,
                      0.5
                  )
                : []
        );

        const pla: [number, string] =
            stories === 1 && prng.random() < 1 / 3 ? [1, "Pizza Hut"] : [0, ""];
        elementlists.push(
            generateRoof(
                prng,
                xOffset,
                yOffset - hoff - height,
                height,
                strokeWidth * Math.pow(0.9, i),
                rotation,
                1.5,
                perturbation,
                pla
            )
        );

        hoff += height * 1.5;
    }

    return elementlists.flat();
}

/**
 * Generates a series of arch structures with decreasing size.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the arches.
 * @param yOffset - The y-coordinate offset for the arches.
 * @param strokeWidth - The initial stroke width of the arches.
 * @param stories - The number of arches to generate.
 * @returns An array of SvgPolyline representing the arch structures.
 */
export function generateArch03(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    strokeWidth: number = 50,
    stories: number = 7
): SvgPolyline[] {
    const height = 10,
        rotation = 0.7,
        period = 5;

    const polylineArray: SvgPolyline[][] = [];

    let heightOffset = 0;

    /**
     * Defines the decoration for the arch components.
     * @param upperLeftPoint - Upper left point.
     * @param upperRightPoint - Upper right point.
     * @param bottomLeftPoint - Lower left point.
     * @param bottomRightPoint - Lower right point.
     * @returns An array of points representing the decoration.
     */
    const decoration = (
        upperLeftPoint: Point,
        upperRightPoint: Point,
        bottomLeftPoint: Point,
        bottomRightPoint: Point
    ) =>
        generateDeco(
            1,
            upperLeftPoint,
            upperRightPoint,
            bottomLeftPoint,
            bottomRightPoint,
            [1, 4],
            [1, 2]
        );

    for (let i = 0; i < stories; i++) {
        polylineArray.push(
            generateBox(
                prng,
                xOffset,
                yOffset - heightOffset,
                height,
                strokeWidth * Math.pow(0.85, i),
                rotation,
                period / 2,
                false,
                true,
                1.5,
                decoration
            )
        );
        polylineArray.push(
            generateRail(
                prng,
                xOffset,
                yOffset - heightOffset,
                i * 0.2,
                false,
                height / 2,
                strokeWidth * Math.pow(0.85, i) * 1.1,
                period / 2,
                5,
                true,
                rotation,
                0.5
            )
        );
        polylineArray.push(
            generatePagodaRoof(
                prng,
                xOffset,
                yOffset - heightOffset - height,
                height * 1.5,
                strokeWidth * Math.pow(0.9, i),
                1.5,
                period
            )
        );
        heightOffset += height * 1.5;
    }

    return polylineArray.flat();
}

/**
 * Generates a series of arch structures with increasing size.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the arches.
 * @param yOffset - The y-coordinate offset for the arches.
 * @param stories - The number of arches to generate.
 * @returns An array of SvgPolyline representing the arch structures.
 */
export function generateArch04(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    stories: number = 2
): SvgPolyline[] {
    const height = 15,
        strokeWidth = 30,
        rotation = 0.7,
        period = 5;

    const polylineArray: SvgPolyline[][] = [];

    let heightOffset = 0;

    /**
     * Defines an empty decoration for the larger arch components.
     * @param _1 - Point parameter not used.
     * @param _2 - Point parameter not used.
     * @param _3 - Point parameter not used.
     * @param _4 - Point parameter not used.
     * @returns An empty array since no decoration is applied.
     */
    const emptyDecoration = (_1: Point, _2: Point, _3: Point, _4: Point) => [];

    for (let i = 0; i < stories; i++) {
        polylineArray.push(
            generateBox(
                prng,
                xOffset,
                yOffset - heightOffset,
                height,
                strokeWidth * Math.pow(0.85, i),
                rotation,
                period / 2,
                true,
                true,
                1.5,
                emptyDecoration
            )
        );
        polylineArray.push(
            generateRail(
                prng,
                xOffset,
                yOffset - heightOffset,
                i * 0.2,
                true,
                height / 3,
                strokeWidth * Math.pow(0.85, i) * 1.2,
                period / 2,
                3,
                true,
                rotation,
                0.5
            )
        );
        polylineArray.push(
            generatePagodaRoof(
                prng,
                xOffset,
                yOffset - heightOffset - height,
                height * 1,
                strokeWidth * Math.pow(0.9, i),
                1.5,
                period
            )
        );
        heightOffset += height * 1.2;
    }

    return polylineArray.flat();
}

/**
 * Generates a boat using procedural generation.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the boat.
 * @param yOffset - The y-coordinate offset for the boat.
 * @param scale - The scale factor for the boat.
 * @param flip - Indicates whether to flip the boat horizontally.
 * @returns A Chunk representing the boat.
 */
export function generateBoat(
    prng: PRNG,
    xOffset: number,
    yOffset: number,
    scale: number = 1,
    flip: boolean = false
): Chunk {
    const length = 120;
    const polylineArray: SvgPolyline[][] = [];

    const direction = flip ? -1 : 1;
    polylineArray.push(
        generateMan(
            prng,
            xOffset + 20 * scale * direction,
            yOffset,
            !flip,
            0.5 * scale,
            [0, 30, 20, 30, 10, 30, 30, 30, 30],
            generateStick,
            generateHat02
        )
    );

    const pointList1: Point[] = [];
    const pointList2: Point[] = [];
    const function1 = (x: number) =>
        Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
    const function2 = (x: number) =>
        Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

    for (let i = 0; i < length * scale; i += 5 * scale) {
        pointList1.push(new Point(i * direction, function1(i / length)));
        pointList2.push(new Point(i * direction, function2(i / length)));
    }
    const pointList: Point[] = pointList1.concat(pointList2.reverse());
    polylineArray.push([createPolyline(pointList, xOffset, yOffset, "white")]);
    polylineArray.push([
        stroke(
            prng,
            pointList.map((v) => new Point(xOffset + v.x, yOffset + v.y)),
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            1,
            0.5,
            1,
            (x) => Math.sin(x * Math.PI * 2)
        ),
    ]);

    const chunk: Chunk = new Chunk(
        "boat",
        xOffset,
        yOffset,
        polylineArray.flat()
    );
    return chunk;
}

/**
 * Generates a transmission tower using procedural generation.
 * @param prng - The pseudorandom number generator.
 * @param xOffset - The x-coordinate offset for the transmission tower.
 * @param yOffset - The y-coordinate offset for the transmission tower.
 * @returns An array of SvgPolyline representing the transmission tower.
 */
export function generateTransmissionTower(
    prng: PRNG,
    xOffset: number,
    yOffset: number
): SvgPolyline[] {
    const height = 100,
        strokeWidth = 20;

    const polylines: SvgPolyline[] = [];

    const toGlobal = (v: Point) => new Point(v.x + xOffset, v.y + yOffset);

    const quickStroke = function (points: Point[]) {
        return stroke(
            prng,
            div(points, 5).map(toGlobal),
            "rgba(100,100,100,0.4)",
            "rgba(100,100,100,0.4)",
            1,
            0.5,
            1,
            (_) => 0.5
        );
    };

    const p00 = new Point(-strokeWidth * 0.05, -height);
    const p01 = new Point(strokeWidth * 0.05, -height);

    const p10 = new Point(-strokeWidth * 0.1, -height * 0.9);
    const p11 = new Point(strokeWidth * 0.1, -height * 0.9);

    const p20 = new Point(-strokeWidth * 0.2, -height * 0.5);
    const p21 = new Point(strokeWidth * 0.2, -height * 0.5);

    const p30 = new Point(-strokeWidth * 0.5, 0);
    const p31 = new Point(strokeWidth * 0.5, 0);

    const bezierControlPoints = [
        new Point(0.7, -0.85),
        new Point(1, -0.675),
        new Point(0.7, -0.5),
    ];

    bezierControlPoints.forEach((controlPoint) => {
        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(0, (controlPoint.y - 0.05) * height),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(0, (controlPoint.y - 0.05) * height),
            ])
        );

        polylines.push(
            quickStroke([
                new Point(
                    -controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    -controlPoint.x * strokeWidth,
                    (controlPoint.y + 0.1) * height
                ),
            ])
        );
        polylines.push(
            quickStroke([
                new Point(
                    controlPoint.x * strokeWidth,
                    controlPoint.y * height
                ),
                new Point(
                    controlPoint.x * strokeWidth,
                    (controlPoint.y + 0.1) * height
                ),
            ])
        );
    });

    const line10 = div([p00, p10, p20, p30], 5);
    const line11 = div([p01, p11, p21, p31], 5);

    for (let i = 0; i < line10.length - 1; i++) {
        polylines.push(quickStroke([line10[i], line11[i + 1]]));
        polylines.push(quickStroke([line11[i], line10[i + 1]]));
    }

    polylines.push(quickStroke([p00, p01]));
    polylines.push(quickStroke([p10, p11]));
    polylines.push(quickStroke([p20, p21]));
    polylines.push(quickStroke([p00, p10, p20, p30]));
    polylines.push(quickStroke([p01, p11, p21, p31]));

    return polylines;
}
