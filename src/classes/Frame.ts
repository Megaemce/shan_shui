import Layer from "./Layer";
import PRNG from "./PRNG";
import Range from "./Range";
import SketchLayer from "./SketchLayer";
import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";
import workerBlobURL from "../utils/layerWorker";
import { chunkVisibleLayers } from "../utils/utils";

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame
     *  When passing custom classes or instances to web workers, they are serialized
     *  into plain objects due to the fact that web workers can only communicate using JSON-compatible data types
     */
    layers: Layer[] = [];

    constructor(public id: number) {}

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public addSketchToLayers({ tag, x, y }: SketchLayer): void {
        let layer: Layer;
        if (tag === "middleMountain") {
            layer = new MiddleMountainLayer(x, y, PRNG.random(0, 2 * this.id));
        } else if (tag === "bottomMountain") {
            layer = new BottomMountainLayer(x, y, PRNG.random(0, 2 * Math.PI));
        } else if (tag === "backgroundMountain") {
            layer = new BackgroundMountainLayer(
                x,
                y,
                PRNG.random(0, 100),
                PRNG.randomChoice([500, 1000, 1500])
            );
        } else if (tag === "boat") {
            layer = new BoatLayer(
                x,
                y,
                y / 800,
                PRNG.randomChoice([true, false])
            );
        } else {
            console.warn("Layer tag is outside nominal type!");
            return;
        }
        this.layers.push(layer);
    }

    /**
     * Renders the frame into an SVG string using web workers.
     * @returns {Promise<string>}
     */

    /**
     * Renders the frame into an SVG string using web workers.
     *
     * This function chunks the visible layers of the frame into smaller groups,
     * and then renders each group using a web worker. The rendering process
     * is done asynchronously, and the results are collected and joined into
     * a single string.
     *
     * @returns {Promise<string>} A promise that resolves to the SVG string
     *                           representation of the rendered frame.
     */
    public async render(): Promise<string> {
        const chunks = chunkVisibleLayers(this.layers);

        const chunkPromises = chunks.map((layers) => {
            const workersPromises = layers.map((layer, index) => {
                const workerPromise = new Promise<string>((resolve, reject) => {
                    const worker = new Worker(workerBlobURL);

                    worker.onmessage = (e: MessageEvent) => {
                        worker.terminate();
                        resolve(e.data.stringify);
                    };

                    worker.onerror = (e) => {
                        worker.terminate();
                        reject(
                            new Error(
                                `Worker failed while rendering layer ${layer.tag} from frame${this.id} with error: ${e.message}`
                            )
                        );
                    };

                    worker.postMessage({
                        frameNum: this.id,
                        elements: layer.elements,
                        layerTag: layer.tag,
                        index: index,
                    });
                });

                return workerPromise;
            });

            // Wait for all layer rendering promises to resolve for this chunk
            return Promise.all(workersPromises);
        });

        // Wait for all chunk rendering promises to resolve
        const chunkResults = await Promise.all(chunkPromises);

        // Join the results of each chunk
        return `<g id="frame${this.id}">${chunkResults.join("\n")}</g>`;
    }

    /**
     * Return the current frame range
     * @returns {Range}
     */
    get range(): Range {
        let xMax = -Infinity;
        let xMin = +Infinity;

        for (let i = 0; i < this.layers.length; i++) {
            const layerStart = this.layers[i].range.start;
            const layerEnd = this.layers[i].range.end;

            if (xMin > layerStart) xMin = layerStart;
            if (xMax < layerEnd) xMax = layerEnd;
        }

        return new Range(xMin, xMax);
    }
}
