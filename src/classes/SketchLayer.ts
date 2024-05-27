import ILayer from "../interfaces/ILayer";
import { LayerType } from "../types/LayerType";
import Bound from "./Bound";

/**
 * Represents a design layer with tag and coordinates.
 */
export default class SketchLayer implements ILayer {
    /**
     * Creates an instance of sketch layer.
     *
     * @param {LayerType} tag - The tag associated with the design layer.
     * @param {number} x - The x-coordinate of the design layer.
     * @param {number} y - The y-coordinate of the design layer.
     * @param {number} width - The width of the design layer.
     * @param {number} [height=0] - The height of the design layer. The boat doesn't have specific height at creation.
     */
    constructor(
        public tag: LayerType,
        public x: number,
        public y: number,
        public width: number,
        public height: number = 0
    ) {}

    /**
     * Checks if this SketchLayer is colliding with another SketchLayer.
     *
     * @param {SketchLayer} layer - The SketchLayer to check collision with.
     * @param {number} [xCollisionRadius=0] - The x-axis collision radius. If positive then extend the original bounds on x-axis. If negative, overlapping is accepted.
     * @param {number} [yCollisionRadius=0] - The y-axis collision radius. If positive then extend the original bounds on y-axis. If negative, overlapping is accepted.
     * @return {boolean} - Returns true if the SketchLayers are colliding, false otherwise.
     */
    public isColliding(
        layer: SketchLayer,
        xCollisionRadius: number = 0,
        yCollisionRadius: number = 0
    ): boolean {
        const bound1 = new Bound(
            this.x - xCollisionRadius,
            this.x + this.width + xCollisionRadius,
            this.y - yCollisionRadius,
            this.y + this.height + yCollisionRadius
        );
        const bound2 = new Bound(
            layer.x,
            layer.x + layer.width,
            layer.y,
            layer.y + layer.height
        );

        // Check for overlap
        const isOverlappingX =
            bound1.xMin <= bound2.xMax && bound1.xMax >= bound2.xMin;
        const isOverlappingY =
            bound1.yMin <= bound2.yMax && bound1.yMax >= bound2.yMin;

        return isOverlappingX && isOverlappingY;
    }
}
