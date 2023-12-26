import Chunk from "../Chunk";
import Point from "../Point";
import PRNG from "../PRNG";
import SvgPolyline from "../SvgPolyline";
import Stroke from "../svgPolylines/Stroke";
import Man from "../complexSvgs/Man";

export default class BoatChunk extends Chunk {
    constructor(
        prng: PRNG,
        xOffset: number,
        yOffset: number,
        scale: number = 1,
        flip: boolean = false
    ) {
        super("boat", xOffset, yOffset);

        const length = 120;

        const direction = flip ? -1 : 1;
        this.add(
            new Man(
                prng,
                xOffset + 20 * scale * direction,
                yOffset,
                !flip,
                0.5 * scale,
                [0, 30, 20, 30, 10, 30, 30, 30, 30],
                true,
                2
            )
        );

        const pointList1: Point[] = [];
        const pointList2: Point[] = [];
        const function1 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * scale;
        const function2 = (x: number) =>
            Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * scale;

        for (let i = 0; i < length * scale; i += 5 * scale) {
            pointList1.push(new Point(i * direction, function1(i / length)));
            pointList2.push(new Point(i * direction, function2(i / length)));
        }
        const pointList: Point[] = pointList1.concat(pointList2.reverse());

        this.add(new SvgPolyline(pointList, xOffset, yOffset, "white"));
        this.add(
            new Stroke(
                prng,
                pointList.map((v) => new Point(xOffset + v.x, yOffset + v.y)),
                "rgba(100,100,100,0.4)",
                "rgba(100,100,100,0.4)",
                1,
                0.5,
                1,
                (x) => Math.sin(x * Math.PI * 2)
            )
        );
    }
}
