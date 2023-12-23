import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import Stroke from "../svgPolylines/Stroke";
import { div } from "../../utils/div";
import Blob from "../svgPolylines/Blob";
import Bark from "./Bark";
import ComplexSvg from "../ComplexSvg";

/**
 * Generates a bark-like structure by combining two sets of points and adding details.
 */
export default class Barkify extends ComplexSvg {
    /**
     * Constructor for the BarkifyGenerator class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate offset.
     * @param y - Y-coordinate offset.
     * @param trlist - Two lists of points representing the structure to be combined.
     */
    constructor(prng: PRNG, x: number, y: number, trlist: Point[][]) {
        super();

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
                this.add(
                    new Blob(
                        prng,
                        newX + x,
                        newY + y,
                        (a0 + a1) / 2,
                        "rgba(100,100,100,0.6)",
                        15,
                        6 - Math.abs(p - 0.5) * 10,
                        1
                    )
                );
            } else {
                this.add(
                    new Bark(
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
                    this.add(
                        new Blob(
                            prng,
                            xya[0] + x + Math.cos(xya[2]) * (j - jl / 2) * 4,
                            xya[1] + y + Math.sin(xya[2]) * (j - jl / 2) * 4,
                            a0 + Math.PI / 2,
                            "rgba(100,100,100,0.6)",
                            prng.random(4, 10),
                            4
                        )
                    );
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
                this.add(
                    new Stroke(
                        prng,
                        rglist[i].map(function (p: Point) {
                            return new Point(p.x + x, p.y + y);
                        }),
                        "rgba(100,100,100,0.7)",
                        "rgba(100,100,100,0.7)",
                        1.5,
                        0.5,
                        0
                    )
                );
            }
        }
    }
}
