import Bark from "./Bark";
import Blob from "../elements/Blob";
import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import { lineDivider } from "../../utils/polytools";

/**
 * Generates a bark-like structure by combining two sets of points and adding details.
 * @extends Structure
 */
export default class Barkify extends Structure {
    /**
     * Creates an instance of the Barkify class.
     * @param {number} x - The x-coordinate offset for the SVG structure.
     * @param {number} y - The y-coordinate offset for the SVG structure.
     * @param {[Point[], Point[]]} branches - A tuple containing two arrays of points representing the left and right branches.
     */
    constructor(
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
            const p = PRNG.random();
            const newX = leftBranches[i].x * (1 - p) + rightBranches[i].x * p;
            const newY = leftBranches[i].y * (1 - p) + rightBranches[i].y * p;

            // Add Blob or Bark based on random probability
            if (PRNG.random() < 0.2) {
                this.add(
                    new Blob(
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
                        newX + x,
                        newY + y,
                        5 - Math.abs(p - 0.5) * 10,
                        (angle0 + angle1) / 2
                    )
                );
            }
            // Add blobs with a certain probability
            if (PRNG.random() < 0.05) {
                const blobLength = PRNG.random(2, 4);
                const [blobX, blobY, blobAngle] = PRNG.randomChoice([
                    [leftBranches[i].x, leftBranches[i].y, angle0],
                    [rightBranches[i].x, rightBranches[i].y, angle1],
                ]);

                for (let j = 0; j < blobLength; j++) {
                    this.add(
                        new Blob(
                            blobX +
                                x +
                                Math.cos(blobAngle) * (j - blobLength / 2) * 4,
                            blobY +
                                y +
                                Math.sin(blobAngle) * (j - blobLength / 2) * 4,
                            angle0 + Math.PI / 2,
                            "rgba(100,100,100,0.6)",
                            PRNG.random(4, 10),
                            4
                        )
                    );
                }
            }
        }

        const trflist = leftBranches.concat(rightBranches.slice().reverse());

        // Generate random groups of points
        trflist.forEach((point) => {
            if (PRNG.random() < 0.5) {
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
                    (Perlin.noise(i, j * 0.1, 1) - 0.5) *
                    (15 + 5 * PRNG.gaussianRandom());
                point.y +=
                    (Perlin.noise(i, j * 0.1, 2) - 0.5) *
                    (15 + 5 * PRNG.gaussianRandom());
            });

            this.add(
                new Stroke(
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
