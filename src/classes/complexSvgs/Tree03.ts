import Blob from "../svgPolylines/Blob";
import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import SvgPolyline from "../SvgPolyline";

/**
 * Generates a tree with branches and leaves influenced by a custom bending function.
 */
export default class Tree03 extends ComplexSvg {
    /**
     * Constructor for the Tree03Generator class.
     * @param x - X-coordinate of the tree base.
     * @param y - Y-coordinate of the tree base.
     * @param height - Height of the tree.
     * @param color - Color of the tree.
     * @param bendingAngle - Custom bending function.
     */
    constructor(
        x: number,
        y: number,
        height: number = 16,
        color: string = "rgba(100,100,100,0.5)",
        bendingAngle: (x: number) => number = (_) => 0
    ) {
        super();

        const strokeWidth: number = 5;
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
        const line1: Point[] = [];
        const line2: Point[] = [];
        for (let i = 0; i < resolution; i++) {
            const newX = x + bendingAngle(i / resolution) * 100;
            const newY = y - (i * height) / resolution;
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
            line1.push(
                new Point(
                    newX +
                        (((noiseArray[i][0] - 0.5) * strokeWidth -
                            strokeWidth / 2) *
                            (resolution - i)) /
                            resolution,
                    newY
                )
            );
            line2.push(
                new Point(
                    newX +
                        (((noiseArray[i][1] - 0.5) * strokeWidth +
                            strokeWidth / 2) *
                            (resolution - i)) /
                            resolution,
                    newY
                )
            );
        }
        const lc = line1.concat(line2.reverse());
        this.add(new SvgPolyline(lc, 0, 0, "white", color, 1.5));
    }
}
