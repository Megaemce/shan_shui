import Blob from "../elements/Blob";
import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Element from "../Element";

/**
 * Generates a tree with branches and leaves influenced by a custom bending function.
 */
export default class Tree03 extends Structure {
    /**
     * Initializes a new instance of the Tree03 class.
     *
     * @param {number} xOffset - The x-coordinate offset of the tree.
     * @param {number} yOffset - The y-coordinate offset of the tree.
     * @param {number} [height=16] - The height of the tree.
     * @param {string} [color="rgba(100,100,100,0.5)"] - The color of the tree.
     * @param {(x: number) => number} bendingAngle - The bending angle function.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        height: number = 16,
        color: string = "rgba(100,100,100,0.5)",
        bendingAngle: (x: number) => number
    ) {
        super();

        const strokeWidth: number = 5;
        const resolution = 10;
        const pointArray = new Array<Point>(resolution * 2);

        let leafcol;
        if (color.includes("rgba(")) {
            leafcol = color.replace("rgba(", "").replace(")", "").split(",");
        } else {
            leafcol = ["100", "100", "100", "0.5"];
        }

        for (let i = 0; i < resolution; i++) {
            const newX = xOffset + bendingAngle(i / resolution) * 100;
            const newY = yOffset - (i * height) / resolution;

            if (i >= resolution / 5) {
                for (let j = 0; j < (resolution - i) * 2; j++) {
                    const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
                    const ox =
                        PRNG.random(0, 2) *
                        strokeWidth *
                        shape((resolution - i) / resolution);
                    const lcol = `rgba(${leafcol[0]},${leafcol[1]},${
                        leafcol[2]
                    },${(PRNG.random(0, 0.2) + parseFloat(leafcol[3])).toFixed(
                        3
                    )})`;
                    this.add(
                        new Blob(
                            newX + ox * PRNG.randomChoice([-1, 1]),
                            newY + PRNG.random(-1, 1) * strokeWidth,
                            (PRNG.random(-0.5, 0.5) * Math.PI) / 6,
                            lcol,
                            ox * 2,
                            PRNG.random(3, 9)
                        )
                    );
                }
            }
            pointArray[i] = new Point(
                newX +
                    (((Perlin.noise(i * 0.5) - 0.5) * strokeWidth -
                        strokeWidth / 2) *
                        (resolution - i)) /
                        resolution,
                newY
            );
            pointArray[resolution * 2 - 1 - i] = new Point(
                newX +
                    (((Perlin.noise(i * 0.5, 0.5) - 0.5) * strokeWidth +
                        strokeWidth / 2) *
                        (resolution - i)) /
                        resolution,
                newY
            );
        }
        this.addAtStart(new Element(pointArray, 0, 0, "white", color, 1.5));
    }
}
