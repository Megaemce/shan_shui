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
 * @extends ComplexSvg
 */
export default class Barkify extends ComplexSvg {
    /**
     * Creates an instance of the Barkify class.
     * @param {PRNG} prng - The pseudo-random number generator to use for randomness.
     * @param {number} x - The x-coordinate offset for the SVG structure.
     * @param {number} y - The y-coordinate offset for the SVG structure.
     * @param {[Point[], Point[]]} branches - A tuple containing two arrays of points representing the left and right branches.
     */
    constructor(
        prng: PRNG,
        x: number,
        y: number,
        [leftBranches, rightBranches]: [Point[], Point[]]
    ) {
        super();

        const randomGroupArray: Point[][] = [[]];

        for (let i = 2; i < leftBranches.length - 1; i++) {
            const angle0 = Math.atan2(
                leftBranches[i].y - leftBranches[i - 1].y,
                leftBranches[i].x - leftBranches[i - 1].x
            );
            const angle1 = Math.atan2(
                rightBranches[i].y - rightBranches[i - 1].y,
                rightBranches[i].x - rightBranches[i - 1].x
            );
            const p = prng.random();
            const newX = leftBranches[i].x * (1 - p) + rightBranches[i].x * p;
            const newY = leftBranches[i].y * (1 - p) + rightBranches[i].y * p;

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
                    [leftBranches[i].x, leftBranches[i].y, angle0],
                    [rightBranches[i].x, rightBranches[i].y, angle1],
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

        const trflist = leftBranches.concat(rightBranches.slice().reverse());

        // Generate random groups of points
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
