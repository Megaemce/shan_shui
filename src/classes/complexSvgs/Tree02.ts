import ComplexSvg from "../ComplexSvg";
import PRNG from "../PRNG";
import Blob from "../svgPolylines/Blob";

/**
 * Generates a tree with blob-like clusters of branches.
 */
export default class Tree02 extends ComplexSvg {
    /**
     * Constructor for the Tree02Generator class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate of the tree base.
     * @param y - Y-coordinate of the tree base.
     * @param col - Color of the tree.
     * @param clu - Number of blob-like clusters.
     */
    constructor(
        prng: PRNG,
        x: number,
        y: number,
        col: string = "rgba(100,100,100,0.5)",
        clu: number = 5
    ) {
        super();

        const height: number = 16,
            strokeWidth: number = 8;

        const bfunc = (x: number) =>
            x <= 1
                ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);

        for (let i = 0; i < clu; i++) {
            this.add(
                new Blob(
                    prng,
                    x + prng.gaussianRandom() * clu * 4,
                    y + prng.gaussianRandom() * clu * 4,
                    Math.PI / 2,
                    col,
                    prng.random(0.5, 1.25) * height,
                    prng.random(0.5, 1.25) * strokeWidth,
                    0.5,
                    bfunc
                )
            );
        }
    }
}
