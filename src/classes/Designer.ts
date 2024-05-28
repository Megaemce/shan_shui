import PRNG from "./PRNG";
import Perlin from "./Perlin";
import Range from "./Range";
import SketchLayer from "./SketchLayer";
import { LayerType } from "../types/LayerType";
import { config } from "../config";

const BACKGROUND_MOUNTAIN_INTERVAL =
    config.designer.backgroundMountain.interval;
const BACKGROUND_MOUNTAIN_HEIGHT = config.designer.backgroundMountain.height;
const BACKGROUND_MOUNTAIN_WIDTH = config.designer.backgroundMountain.width;
const BACKGROUND_MOUNTAIN_YLOCATION_MIN =
    config.designer.backgroundMountain.yLocation.min;
const BACKGROUND_MOUNTAIN_YLOCATION_MAX =
    config.designer.backgroundMountain.yLocation.max;
const BOAT_PROBABILITY = config.designer.boat.probability;
const BOAT_WIDTH = config.designer.boat.width;
const BOAT_Y_MAX = config.designer.boat.y.max;
const BOAT_Y_MIN = config.designer.boat.y.min;
const BOTTOM_MOUNTAIN_HEIGHT_MAX = config.designer.bottomMountain.height.max;
const BOTTOM_MOUNTAIN_HEIGHT_MIN = config.designer.bottomMountain.height.min;
const BOTTOM_MOUNTAIN_PROBABILITY = config.designer.bottomMountain.probability;
const BOTTOM_MOUNTAIN_WIDTH_MAX = config.designer.bottomMountain.width.max;
const BOTTOM_MOUNTAIN_WIDTH_MIN = config.designer.bottomMountain.width.min;
const BOTTOM_MOUNTAIN_XOFFSET_MIN = config.designer.bottomMountain.xOffset.min;
const BOTTOM_MOUNTAIN_XOFFSET_MAX = config.designer.bottomMountain.xOffset.max;
const MIDDLE_MOUNTAIN_PROBABILITY = config.designer.middleMountain.probability;
const MIDDLE_MOUNTAIN_HEIGHT_MAX = config.designer.middleMountain.height.max;
const MIDDLE_MOUNTAIN_HEIGHT_MIN = config.designer.middleMountain.height.min;
const MIDDLE_MOUNTAIN_WIDTH_MAX = config.designer.middleMountain.width.max;
const MIDDLE_MOUNTAIN_WIDTH_MIN = config.designer.middleMountain.width.min;
const MIDDLE_MOUNTAIN_XOFFSET_MIN = config.designer.middleMountain.xOffset.min;
const MIDDLE_MOUNTAIN_XOFFSET_MAX = config.designer.middleMountain.xOffset.max;
const MIDDLE_MOUNTAIN_YOFFSET = config.designer.middleMountain.yOffset;
const RADIUS = config.designer.radius;
const WATER_HEIGHT = config.designer.water.height;
const WATER_WIDTH = config.designer.water.width;
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
    constructor(public range: Range) {
        this.generateDesign(range);
    }

    /**
     * Checks if a new layer can fit within the existing plan without colliding with other layers.
     *
     * @param {SketchLayer} newLayer - The new layer to check.
     * @param {number} [xCollisionRadius=RADIUS] - The x-axis collision radius. If positive then extend the original bounds on x-axis. If negative, overlapping is accepted.
     * @param {number} [yCollisionRadius=RADIUS] - The y-axis collision radius. If positive then extend the original bounds on y-axis. If negative, overlapping is accepted.
     * @param {Array<LayerType>} [tagArray=[]] - An array of tags to check for collision. If empty, only local layers are checked.
     * @return {boolean} Returns true if the new layer can fit without colliding, false otherwise.
     */
    private canFit(
        newLayer: SketchLayer,
        xCollisionRadius: number = RADIUS,
        yCollisionRadius: number = RADIUS,
        tagArray: Array<LayerType> = []
    ): boolean {
        const isNotColliding = this.plan.every((layer) => {
            const isLocal = tagArray.length === 0 && layer.tag === newLayer.tag;
            const isTagged = tagArray.includes(layer.tag);

            if (
                (isLocal || isTagged) &&
                layer.isColliding(newLayer, xCollisionRadius, yCollisionRadius)
            ) {
                return false;
            }
            return true;
        });

        // TODO: Make is better, as for some reasons the frame are dropping when moving forward
        const isWithinDesignerRange = true; //newLayer.x + newLayer.width < this.range.end;

        return isNotColliding && isWithinDesignerRange;
    }

    /**
     * Generate new design within given range. Order here matter as the elements check for collision with each other.
     * @private
     */
    private generateDesign(range: Range): void {
        const yRange = (x: number) => Perlin.noise(x * 0.01, Math.PI);
        const middleMountainPositions: Array<{ x: number; y: number }> = [];

        // Generate BackgroundMountains
        for (let x = range.start; x < range.end; x += X_STEP) {
            if (
                Math.abs(x) % BACKGROUND_MOUNTAIN_INTERVAL <
                Math.max(1, X_STEP - 1)
            ) {
                const y = PRNG.random(
                    BACKGROUND_MOUNTAIN_YLOCATION_MIN,
                    BACKGROUND_MOUNTAIN_YLOCATION_MAX
                );
                // TODO: This for some reason cannot be just PRNG.random().
                // BackgroundMountain triangulation probably causing some issue
                // It's using span = 10 and segments = 5, and then dividing width by it.
                // So probably the width need to be divideable by 50.
                const width = PRNG.randomChoice([
                    BACKGROUND_MOUNTAIN_WIDTH[0],
                    BACKGROUND_MOUNTAIN_WIDTH[1],
                    BACKGROUND_MOUNTAIN_WIDTH[2],
                ]);
                const backgroundMountain = new SketchLayer(
                    "backgroundMountain",
                    x,
                    y,
                    width,
                    BACKGROUND_MOUNTAIN_HEIGHT
                );

                if (this.canFit(backgroundMountain)) {
                    this.plan.push(backgroundMountain);
                }
            }
        }

        // Generate MiddleMountains
        for (let x = range.start; x < range.end; x += X_STEP) {
            if (PRNG.random() < MIDDLE_MOUNTAIN_PROBABILITY) {
                for (let y = 0; y < yRange(x) * 480; y += 30) {
                    const width = PRNG.random(
                        MIDDLE_MOUNTAIN_WIDTH_MIN,
                        MIDDLE_MOUNTAIN_WIDTH_MAX
                    );
                    const height = PRNG.random(
                        MIDDLE_MOUNTAIN_HEIGHT_MIN,
                        MIDDLE_MOUNTAIN_HEIGHT_MAX
                    );

                    const xOffset =
                        x +
                        PRNG.random(
                            MIDDLE_MOUNTAIN_XOFFSET_MIN,
                            MIDDLE_MOUNTAIN_XOFFSET_MAX
                        );

                    const yOffset = y + MIDDLE_MOUNTAIN_YOFFSET;

                    const middleMountain = new SketchLayer(
                        "middleMountain",
                        xOffset,
                        yOffset,
                        width,
                        height
                    );

                    if (
                        this.canFit(
                            middleMountain,
                            10,
                            -MIDDLE_MOUNTAIN_HEIGHT_MAX
                        )
                    ) {
                        this.plan.push(middleMountain);
                        // keep track of the x positions of the visible middle mountains for water creation
                        middleMountainPositions.push({
                            x: xOffset,
                            y: yOffset,
                        });
                    }
                }
            }
        }

        // Generate BottomMountains
        for (let x = range.start; x < range.end; x += X_STEP) {
            if (PRNG.random() < BOTTOM_MOUNTAIN_PROBABILITY) {
                for (let j = 0; j < PRNG.random(0, 4); j++) {
                    const xOffset = PRNG.random(
                        BOTTOM_MOUNTAIN_XOFFSET_MIN,
                        BOTTOM_MOUNTAIN_XOFFSET_MAX
                    );
                    const y = 850 - j * 50;
                    const width = PRNG.random(
                        BOTTOM_MOUNTAIN_WIDTH_MIN,
                        BOTTOM_MOUNTAIN_WIDTH_MAX
                    );
                    const height = PRNG.random(
                        BOTTOM_MOUNTAIN_HEIGHT_MIN,
                        BOTTOM_MOUNTAIN_HEIGHT_MAX
                    );
                    const bottomMountain = new SketchLayer(
                        "bottomMountain",
                        x + xOffset,
                        y,
                        width,
                        height
                    );

                    if (
                        this.canFit(bottomMountain, 10, -100, [
                            "bottomMountain",
                            "middleMountain",
                        ])
                    ) {
                        this.plan.push(bottomMountain);
                    }
                }
            }
        }

        // Generate Water
        middleMountainPositions.forEach(({ x: xOffset, y: yOffset }) => {
            const water = new SketchLayer(
                "water",
                xOffset - RADIUS, // making sure that the water will not false positivily collide with the middleMountain
                yOffset + 10,
                WATER_WIDTH,
                WATER_HEIGHT
            );

            if (this.canFit(water, 10, 10, ["water", "bottomMountain"])) {
                this.plan.push(water);
            }
        });

        // Generate Boats
        for (let x = range.start; x < range.end; x += X_STEP) {
            if (PRNG.random() < BOAT_PROBABILITY) {
                const y = PRNG.random(BOAT_Y_MIN, BOAT_Y_MAX);
                const boatChunk = new SketchLayer("boat", x, y, BOAT_WIDTH);

                if (
                    this.canFit(boatChunk, 10, 100, [
                        "boat",
                        "water",
                        "middleMountain",
                        "bottomMountain",
                    ])
                ) {
                    this.plan.push(boatChunk);
                }
            }
        }
    }
}
