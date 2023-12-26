import Point from "../Point";
import { lineDivider } from "../../utils/polytools";

/**
 * Generates decorative elements based on the specified style.
 * @param {number} style - The style of decoration to generate.
 * @param {Point} [upperLeftPoint=Point.O] - The upper-left point of the bounding box.
 * @param {Point} [upperRightPoint=new Point(0, 100)] - The upper-right point of the bounding box.
 * @param {Point} [bottomLeftPoint=new Point(100, 0)] - The lower-left point of the bounding box.
 * @param {Point} [bottomRightPoint=new Point(100, 100)] - The lower-right point of the bounding box.
 * @param {number[]} [hsp=[1, 3]] - The horizontal subdivision parameters.
 * @param {number[]} [vsp=[1, 2]] - The vertical subdivision parameters.
 * @returns {Point[][]} An array of points representing the decorative elements.
 */
export default function generateDecoration(
    style: number,
    upperLeftPoint: Point = Point.O,
    upperRightPoint: Point = new Point(0, 100),
    bottomLeftPoint: Point = new Point(100, 0),
    bottomRightPoint: Point = new Point(100, 100),
    hsp: number[] = [1, 3],
    vsp: number[] = [1, 2]
): Point[][] {
    const pointArray: Point[][] = [];
    const dl = lineDivider([upperLeftPoint, bottomLeftPoint], vsp[1]);
    const dr = lineDivider([upperRightPoint, bottomRightPoint], vsp[1]);
    const du = lineDivider([upperLeftPoint, upperRightPoint], hsp[1]);
    const dd = lineDivider([bottomLeftPoint, bottomRightPoint], hsp[1]);

    if (style === 1) {
        // -| |-
        const mlu = du[hsp[0]];
        const mru = du[du.length - 1 - hsp[0]];
        const mld = dd[hsp[0]];
        const mrd = dd[du.length - 1 - hsp[0]];

        for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
            const mml = lineDivider([mlu, mld], vsp[1])[i];
            const mmr = lineDivider([mru, mrd], vsp[1])[i];
            const ml = dl[i];
            const mr = dr[i];
            pointArray.push(lineDivider([mml, ml], 5));
            pointArray.push(lineDivider([mmr, mr], 5));
        }
        pointArray.push(lineDivider([mlu, mld], 5));
        pointArray.push(lineDivider([mru, mrd], 5));
    } else if (style === 2) {
        // ||||
        for (let i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
            const mu = du[i];
            const md = dd[i];
            pointArray.push(lineDivider([mu, md], 5));
        }
    } else if (style === 3) {
        // |##|
        const mlu = du[hsp[0]];
        const mru = du[du.length - 1 - hsp[0]];
        const mld = dd[hsp[0]];
        const mrd = dd[du.length - 1 - hsp[0]];

        for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
            const mml = lineDivider([mlu, mld], vsp[1])[i];
            const mmr = lineDivider([mru, mrd], vsp[1])[i];
            const mmu = lineDivider([mlu, mru], vsp[1])[i];
            const mmd = lineDivider([mld, mrd], vsp[1])[i];

            pointArray.push(lineDivider([mml, mmr], 5));
            pointArray.push(lineDivider([mmu, mmd], 5));
        }
        pointArray.push(lineDivider([mlu, mld], 5));
        pointArray.push(lineDivider([mru, mrd], 5));
    }
    return pointArray;
}
