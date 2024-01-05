import Blob from "../svgPolylines/Blob";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";

/**
 * Generates a tree with undulating branches and leaves.
 */
export default class Tree01 extends ComplexSvg {
    /**
     * Constructor for the TreeGenerator class.
     * @param x - X-coordinate of the tree base.
     * @param y - Y-coordinate of the tree base.
     * @param height - Height of the tree.
     * @param strokeWidth - Width of the tree branches.
     * @param color - Color of the tree.
     */
    constructor(
        x: number,
        y: number,
        height: number = 50,
        strokeWidth: number = 3,
        color: string = "rgba(100,100,100,0.5)"
    ) {
        super();

        const resolution = 10;
        const noiseArray = [];
        for (let i = 0; i < resolution; i++) {
            noiseArray.push([
                Perlin.noise(i * 0.5),
                Perlin.noise(i * 0.5, 0.5),
            ]);
        }

        let leafcol;
        if (color.includes("rgba(")) {
            leafcol = color.replace("rgba(", "").replace(")", "").split(",");
        } else {
            leafcol = ["100", "100", "100", "0.5"];
        }

        const line1 = [];
        const line2 = [];
        for (let i = 0; i < resolution; i++) {
            const newX = x;
            const newY = y - (i * height) / resolution;
            if (i >= resolution / 4) {
                for (let j = 0; j < (resolution - i) / 5; j++) {
                    const lcol = `rgba(${leafcol[0]},${leafcol[1]},${
                        leafcol[2]
                    },${(PRNG.random(0, 0.2) + parseFloat(leafcol[3])).toFixed(
                        1
                    )})`;
                    this.add(
                        new Blob(
                            newX +
                                strokeWidth *
                                    PRNG.random(-0.6, 0.6) *
                                    (resolution - i),
                            newY + PRNG.random(-0.5, 0.5) * strokeWidth,
                            (Math.PI / 6) * PRNG.random(-0.5, 0.5),
                            lcol,
                            PRNG.random(10, 10 + 4 * (resolution - i)),
                            PRNG.random(3, 9)
                        )
                    );
                }
            }
            line1.push(
                new Point(
                    newX +
                        (noiseArray[i][0] - 0.5) * strokeWidth -
                        strokeWidth / 2,
                    newY
                )
            );
            line2.push(
                new Point(
                    newX +
                        (noiseArray[i][1] - 0.5) * strokeWidth +
                        strokeWidth / 2,
                    newY
                )
            );
        }

        this.add(new SvgPolyline(line1, 0, 0, "none", color, 1.5));
        this.add(new SvgPolyline(line2, 0, 0, "none", color, 1.5));
    }
}
