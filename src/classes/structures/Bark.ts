import Structure from "../Structure";
import PRNG from "../PRNG";
import Perlin from "../Perlin";
import Point from "../Point";
import Stroke from "../elements/Stroke";
import { normalizeNoise } from "../../utils/utils";

/**
 * Generates a bark-like structure.
 */
export default class Bark extends Structure {
    /**
     * Constructor for the BarkGenerator class.
     * @param {number} xOffset - X-coordinate of the bark.
     * @param {number} yOffset - Y-coordinate of the bark.
     * @param {number} strokeWidth - Width of the bark.
     * @param {number} angle - Angle of the bark.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        strokeWidth: number,
        angle: number
    ) {
        super();

        const fun = function (x: number) {
            return x <= 1
                ? Math.pow(Math.sin(x * Math.PI), 0.5)
                : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
        };
        const n0 = PRNG.random() * 10;
        const width = PRNG.random(10, 20);
        const noise = 0.5;
        const resolution = 20;
        const lengthAngleArray = Array<[number, number]>(resolution + 1);

        let noiseArray = Array<number>(resolution + 1);

        for (let i = 0; i <= resolution; i++) {
            const p = (i / resolution) * 2;
            const xo = width / 2 - Math.abs(p - 1) * width;
            const yo = (fun(p) * strokeWidth) / 2;
            const a = Math.atan2(yo, xo);
            const l = Math.sqrt(xo * xo + yo * yo);

            lengthAngleArray[i] = [l, a];
            noiseArray[i] = Perlin.noise(i * 0.05, n0);
        }

        normalizeNoise(noiseArray);

        const barkArray = lengthAngleArray.map(([l, a], i) => {
            const localNoise = noiseArray[i] * noise + (1 - noise);
            const newX = xOffset + Math.cos(a + angle) * l * localNoise;
            const newY = yOffset + Math.sin(a + angle) * l * localNoise;

            return new Point(newX, newY);
        });

        this.add(
            new Stroke(
                barkArray,
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                0.8,
                0,
                0,
                (x) => Math.sin((x + PRNG.random()) * Math.PI * 3)
            )
        );
    }
}
