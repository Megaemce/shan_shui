import { Point } from "../../classes/Point";
import { Noise } from "../../classes/PerlinNoise";
import { generateStroke } from "../brushes/generateStroke";
import { generateTexture } from "../brushes/generateTexture";
import { div } from "../brushes/div";
import { PRNG } from "../../classes/PRNG";
import { SvgPolyline } from "../../classes/SvgPolyline";
import { Chunk } from "../../classes/Chunk";
import { calculateBoundingBox } from "./generateMountains";
import { generateFlatDecorations } from "./generateFlatDecorations";

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
        SvgPolyline.createPolyline(
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
        SvgPolyline.createPolyline(
            grlist,
            xOffset,
            yOffset,
            "white",
            "none",
            2
        ),
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
