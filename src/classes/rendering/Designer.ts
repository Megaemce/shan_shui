import PRNG from "../PRNG";
import Perlin from "../Perlin";
import SketchLayer from "../SketchLayer";
import { config } from "../../config";
import { isLocalMaximum } from "../../utils/utils";
import Range from "../Range";
import { LayerType } from "../../types/LayerType";

const BOAT_PROBABILITY = config.designer.boat.probability;
const BOAT_RADIUS_THRESHOLD = config.designer.boat.radiusThreshold;
const BACKGROUND_MOUNTAIN_INTERVAL =
    config.designer.backgroundMountain.interval;
const BOTTOM_MOUNTAIN_PROBABILITY = config.designer.bottomMountain.probability;
const MAX_BOAT_Y = config.designer.boat.y.max;
const MIN_BOAT_Y = config.designer.boat.y.min;
const MOUNTAIN_COVER_THRESHOLD = config.designer.middleMountain.coverThreshold;
const MOUNTAIN_RADIUS = config.designer.middleMountain.radius;
const NOISE_SAMPLE = config.designer.noiseSample;
const RADIUS = config.designer.radius;
const X_STEP = config.designer.xStep;

/**
 * Class for designing new frame. The main reason for this class is to generate new terrain
 * with certainty that the new frames will not collide with each other in ugly manner.
 */
export default class Designer {
    plan: SketchLayer[] = [];
    /**
     * Generates terrain design.
     * @param {Range} range - range for which to generate design.
     */
    constructor(range: Range) {
        this.generateDesign(range);
        this.sortPlan();
    }

    /**
     * Checks if a new layer is colliding with layers with the same tag or with all the layers with given tags from `tagArray`.
     * @private
     * @param {SketchLayer} newLayer - The layer to check.
     * @param {number} [radius=RADIUS] - The threshold radius for considering layers to be the same.
     * @param {Array<LayerType>} [tagArray=[]] - Check for layers with these tags
     * @returns {boolean} True if the layer needs to be added, false otherwise.
     */
    private isColliding(
        newLayer: SketchLayer,
        radius: number = RADIUS,
        tagArray: Array<LayerType> = []
    ): boolean {
        return this.plan.some((layer) => {
            const isLocal = tagArray.length === 0 && layer.tag === newLayer.tag;
            const isTagged = tagArray.includes(layer.tag);

            if (
                (isLocal || isTagged) &&
                Math.abs(layer.x - newLayer.x) < radius
            ) {
                return true;
            }
            return false;
        });
    }
    /**
     * Generate new design within given range.
     * @private
     */
    private generateDesign(range: Range): void {
        const yRange = (x: number) => Perlin.noise(x * 0.01, Math.PI);
        const noiseFunction = (x: number) =>
            Math.max(Perlin.noise(x * NOISE_SAMPLE) - 0.55, 0) * 2;

        for (let i = 0; i * X_STEP < range.length; i++) {
            const x = range.start + i * X_STEP;

            // generate middleMountain without checking global collision
            if (
                noiseFunction(x) > MOUNTAIN_COVER_THRESHOLD &&
                isLocalMaximum(x, noiseFunction, MOUNTAIN_RADIUS)
            ) {
                for (let y = 0; y < yRange(x) * 480; y += 30) {
                    const xOffset = x + PRNG.random(0, 500);
                    const yOffset = y + 400;

                    const middleMountain = new SketchLayer(
                        "middleMountain",
                        xOffset,
                        yOffset
                    );

                    if (!this.isColliding(middleMountain)) {
                        this.plan.push(middleMountain);
                    }
                }
            }

            // generate bottomMountain without checking global collision
            if (PRNG.random() < BOTTOM_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const bottomMountain = new SketchLayer(
                        "bottomMountain",
                        x + PRNG.random(0, 700),
                        850 - j * 50
                    );

                    if (!this.isColliding(bottomMountain)) {
                        this.plan.push(bottomMountain);
                    }
                }
            }

            // generate backgroundMountain without checking global collision
            if (
                Math.abs(x) % BACKGROUND_MOUNTAIN_INTERVAL <
                Math.max(1, X_STEP - 1)
            ) {
                const backgroundMountain = new SketchLayer(
                    "backgroundMountain",
                    x,
                    PRNG.random(230, 280)
                );

                if (!this.isColliding(backgroundMountain)) {
                    this.plan.push(backgroundMountain);
                }
            }

            // generate boats with boat and middleMountain collision detection
            if (PRNG.random() < BOAT_PROBABILITY) {
                const y = PRNG.random(MIN_BOAT_Y, MAX_BOAT_Y);
                const boatChunk = new SketchLayer("boat", x, y);

                if (
                    !this.isColliding(boatChunk, BOAT_RADIUS_THRESHOLD, [
                        "boat",
                        "middleMountain",
                    ])
                ) {
                    this.plan.push(boatChunk);
                }
            }
        }
    }

    /**
     * Sort the layers in the plan by the y coordinate
     */
    private sortPlan(): void {
        this.plan.sort((a, b) => a.y - b.y);
    }
}
