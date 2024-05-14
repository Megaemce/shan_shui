import ILayer from "../interfaces/ILayer";
import Range from "./Range";
import Structure from "./Structure";
import { LayerType } from "../types/LayerType";

/**
 * Represents a layer of terrain with SVG elements.
 */
export default class Layer extends Structure implements ILayer {
    /** Visible range of layer */
    public range: Range = new Range(0, 0);
    /**
     * Initializes a new instance with specified coordinates and tag.
     *
     * @param {LayerType} [tag] - The tag for the layer.
     * @param {number} [x=0] - The x-coordinate.
     * @param {number} [y=0] - The y-coordinate.
     */
    constructor(
        public tag: LayerType,
        public x: number = 0,
        public y: number = 0
    ) {
        super();
    }

    /**
     * Calculcate the layer range and set it into range prop
     * @returns {Range}
     */
    public calcAndSetRange(): void {
        let xMax = -Infinity;
        let xMin = +Infinity;

        for (let i = 0; i < this.elements.length; i++) {
            const elementStart = this.elements[i].range.start;
            const elementEnd = this.elements[i].range.end;

            if (xMin > elementStart) xMin = elementStart;
            if (xMax < elementEnd) xMax = elementEnd;
        }

        this.range = new Range(xMin, xMax);
    }
    /** Set the new range for layer
     * @param {Range} value - new value
     */
    // set range(value: Range) {
    //     this._range = value;
    // }
}
