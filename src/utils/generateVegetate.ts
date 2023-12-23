import Point from "../classes/Point";
import ComplexSvg from "../classes/ComplexSvg";

/**
 * Generate vegetation elements based on specified growth and proof rules.
 * @param {Point[][]} pointArray - 2D array of points representing the terrain.
 * @param {(x: number, y: number) => ComplexSvg} treeFunc - Function to generate vegetation elements at a given location.
 * @param {(i: number, j: number) => boolean} growthRule - Rule determining whether vegetation should grow at a specific point.
 * @param {(pointArray: Point[], i: number) => boolean} proofRule - Rule based upon the vegatation is added or not
 * @returns {void}.
 */
export function generateVegetate(
    pointArray: Point[][],
    treeFunc: (x: number, y: number) => ComplexSvg,
    growthRule: (i: number, j: number) => boolean,
    proofRule: (pointArray: Point[], i: number) => boolean,
    target: ComplexSvg
): void {
    const vegList: Point[] = [];

    // Collect points where vegetation can potentially grow based on growthRule
    for (let i = 0; i < pointArray.length; i += 1) {
        for (let j = 0; j < pointArray[i].length; j += 1) {
            if (growthRule(i, j)) {
                vegList.push(pointArray[i][j].copy());
            }
        }
    }

    // Check additional proofRule conditions and generate vegetation elements
    for (let i = 0; i < vegList.length; i++) {
        if (proofRule(vegList, i)) {
            target.add(treeFunc(vegList[i].x, vegList[i].y));
        }
    }
}
