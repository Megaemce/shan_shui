import Point from "../classes/Point";
import ComplexSvg from "../classes/ComplexSvg";

/**
 * Generate vegetation elements based on specified growth and proof rules.
 * @param {Point[][]} pointArray - A 2D array of points representing the terrain.
 * @param {(x: number, y: number) => ComplexSvg} treeFunc - A function that generates vegetation elements at a given location.
 * @param {(i: number, j: number) => boolean} growthRule - A function that determines whether vegetation should grow at a specific point based on the indices.
 * @param {(pointArray: Point[], i: number) => boolean} proofRule - A function that determines additional conditions for vegetation growth based on the array of potential vegetation points and an index.
 * @param {ComplexSvg} target - The target ComplexSvg element where the generated vegetation elements are to be added.
 * @returns {void}
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
    pointArray.forEach((row, i) => {
        row.forEach((point, j) => {
            if (growthRule(i, j)) {
                vegList.push(point);
            }
        });
    });

    // Check additional proofRule conditions and generate vegetation elements
    vegList.forEach((vegElement, i) => {
        if (proofRule(vegList, i)) {
            target.add(treeFunc(vegElement.x, vegElement.y));
        }
    });
}
