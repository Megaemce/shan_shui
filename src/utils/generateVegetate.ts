import Point from "../classes/Point";
import Structure from "../classes/Structure";

/**
 * Generate vegetation elements based on specified growth and proof rules.
 * @param {Point[][]} elementArray - A 2D array representing terrain's elements with their points.
 * @param {(x: number, y: number) => Structure} treeFunc - A function that generates vegetation elements at a given location.
 * @param {(i: number, j: number) => boolean} growthRule - A function that determines whether vegetation should grow at a specific point based on the indices.
 * @param {(elementArray: Point[], i: number) => boolean} proofRule - A function that determines additional conditions for vegetation growth based on the array of potential vegetation points and an index.
 * @param {Structure} target - The target ComplexSvg element where the generated vegetation elements are to be added.
 * @returns {void}
 */
export function generateVegetate(
    elementArray: Point[][],
    treeFunc: (x: number, y: number) => Structure,
    growthRule: (i: number, j: number) => boolean,
    proofRule: (points: Point[], i: number) => boolean,
    target: Structure
): void {
    const vegList: Point[] = [];

    // Collect points where vegetation can potentially grow based on growthRule
    for (let i = 0; i < elementArray.length; i++) {
        for (let j = 0; j < elementArray[i].length; j++) {
            if (growthRule(i, j)) {
                vegList.push(elementArray[i][j]);
            }
        }
    }

    // Check additional proofRule conditions and generate vegetation on point location
    for (let i = 0; i < vegList.length; i++) {
        if (proofRule(vegList, i)) {
            target.add(treeFunc(vegList[i].x, vegList[i].y));
        }
    }
}
