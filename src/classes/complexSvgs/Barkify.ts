import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import Stroke from "../svgPolylines/Stroke";
import { lineDivider } from "../../utils/polytools";
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
            const angle0 = Math.atan2(
                trlist[0][i].y - trlist[0][i - 1].y,
                trlist[0][i].x - trlist[0][i - 1].x
            );
            const angle1 = Math.atan2(
                trlist[1][i].y - trlist[1][i - 1].y,
                trlist[1][i].x - trlist[1][i - 1].x
            );
            const p = prng.random();
            const newX = trlist[0][i].x * (1 - p) + trlist[1][i].x * p;
            const newY = trlist[0][i].y * (1 - p) + trlist[1][i].y * p;

            // Add Blob or Bark based on random probability
            if (prng.random() < 0.2) {
                this.add(
                    new Blob(
                        prng,
                        newX + x,
                        newY + y,
                        (angle0 + angle1) / 2,
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
                        (angle0 + angle1) / 2
                    )
                );
            }
            // Add blobs with a certain probability
            if (prng.random() < 0.05) {
                const blobLength = prng.random(2, 4);
                const [blobX, blobY, blobAngle] = prng.randomChoice([
                    [trlist[0][i].x, trlist[0][i].y, angle0],
                    [trlist[1][i].x, trlist[1][i].y, angle1],
                ]);

                for (let j = 0; j < blobLength; j++) {
                    this.add(
                        new Blob(
                            prng,
                            blobX +
                                x +
                                Math.cos(blobAngle) * (j - blobLength / 2) * 4,
                            blobY +
                                y +
                                Math.sin(blobAngle) * (j - blobLength / 2) * 4,
                            angle0 + Math.PI / 2,
                            "rgba(100,100,100,0.6)",
                            prng.random(4, 10),
                            4
                        )
                    );
                }
            }
        }

        const trflist = trlist[0].concat(trlist[1].slice().reverse());

        // Generate random groups of points
        const randomGroupArray: Point[][] = [[]];

        trflist.forEach((point) => {
            if (prng.random() < 0.5) {
                randomGroupArray.push([]);
            } else {
                randomGroupArray[randomGroupArray.length - 1].push(point);
            }
        });

        randomGroupArray.forEach((group, i) => {
            if (group.length < 2) return; // Can't execute lineDivider without at least 2 points
            let result = lineDivider(group, 4);

            result.forEach((point, j) => {
                point.x +=
                    (Noise.noise(prng, i, j * 0.1, 1) - 0.5) *
                    (15 + 5 * prng.gaussianRandom());
                point.y +=
                    (Noise.noise(prng, i, j * 0.1, 2) - 0.5) *
                    (15 + 5 * prng.gaussianRandom());
            });

            this.add(
                new Stroke(
                    prng,
                    result.map((point) => new Point(point.x + x, point.y + y)),
                    "rgba(100,100,100,0.7)",
                    "rgba(100,100,100,0.7)",
                    1.5,
                    0.5,
                    0
                )
            );
        });
    }
}
