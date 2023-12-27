import { Noise } from "../PerlinNoise";
import Point from "../Point";
import PRNG from "../PRNG";
import { normalizeNoise } from "../../utils/utils";
import Stroke from "../svgPolylines/Stroke";
import ComplexSvg from "../ComplexSvg";

/**
 * Generates a bark-like structure.
 */
export default class Bark extends ComplexSvg {
    /**
     * Constructor for the BarkGenerator class.
     * @param prng - The pseudo-random number generator.
     * @param x - X-coordinate of the bark.
     * @param y - Y-coordinate of the bark.
     * @param strokeWidth - Width of the bark.
     * @param angle - Angle of the bark.
     */
    constructor(
        prng: PRNG,
        x: number,
        y: number,
        strokeWidth: number,
        angle: number
    ) {
        super();

        const fun = function (x: number) {
            return x <= 1
                ? Math.pow(Math.sin(x * Math.PI), 0.5)
                : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
        };
        const barkArray: Point[] = [];
        const lengthAngleArray: Array<[number, number]> = [];
        const n0 = prng.random() * 10;
        const width = prng.random(10, 20);
        const noise = 0.5;
        const reso = 20;

        let noiseArray: number[] = [];

        for (let i = 0; i < reso + 1; i++) {
            const p = (i / reso) * 2;
            const xo = width / 2 - Math.abs(p - 1) * width;
            const yo = (fun(p) * strokeWidth) / 2;
            const a = Math.atan2(yo, xo);
            const l = Math.sqrt(xo * xo + yo * yo);

            lengthAngleArray.push([l, a]);
        }

        for (let i = 0; i < reso + 1; i++) {
            noiseArray.push(Noise.noise(prng, i * 0.05, n0));
        }

        noiseArray = normalizeNoise(noiseArray);

        lengthAngleArray.forEach(([l, a], i) => {
            const localNoise = noiseArray[i] * noise + (1 - noise);
            const newX = x + Math.cos(a + angle) * l * localNoise;
            const newY = y + Math.sin(a + angle) * l * localNoise;

            barkArray.push(new Point(newX, newY));
        });

        this.add(
            new Stroke(
                prng,
                barkArray,
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                0.8,
                0,
                0,
                (x) => Math.sin((x + prng.random()) * Math.PI * 3)
            )
        );
    }
}
