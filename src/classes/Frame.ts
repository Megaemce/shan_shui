import Layer from "./Layer";
import PRNG from "./PRNG";
import Point from "./Point";
import Range from "./Range";
import Renderer from "./Renderer";
import SketchLayer from "./SketchLayer";
import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";

type LayerSerialized = {
    tag: string;
    x: number;
    y: number;
    range: { start: number; end: number };
    elements: Array<{
        stringify: string;
        range: { start: number; end: number };
        points?: Point[];
    }>;
};

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame
     *  When passing custom classes or instances to web workers, they are serialized
     *  into plain objects due to the fact that web workers can only communicate using JSON-compatible data types
     */
    layers: LayerSerialized[] = [];

    constructor(public id: number) {}

    public async changePlanToFrames(framePlan: SketchLayer[]): Promise<void> {
        const changePromises: Promise<LayerSerialized>[] = [];

        for (let index = 0; index < framePlan.length; index++) {
            const sketch = framePlan[index];

            const worker = new Worker(
                new URL("../utils/planWorker.ts", import.meta.url)
            );

            const changePromise = new Promise<LayerSerialized>(
                (resolve, reject) => {
                    worker.onmessage = (e: MessageEvent) => {
                        worker.terminate();
                        if (e.data.error) {
                            reject(new Error(e.data.error));
                        } else {
                            resolve(e.data.layer);
                        }
                    };

                    worker.onerror = (e) => {
                        worker.terminate();
                        reject(new Error(`Worker error: ${e.message}`));
                    };

                    worker.postMessage({
                        tag: sketch.tag,
                        id: this.id,
                        x: sketch.x,
                        y: sketch.y,
                    });
                }
            );

            changePromises.push(changePromise);
        }

        try {
            const results = await Promise.all(changePromises);
            this.layers.push(...results);
        } catch (error) {
            console.error("Error rendering frame:", error);
            throw error;
        }
    }

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public async addSketchToLayers({ tag, x, y }: SketchLayer): Promise<void> {
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
    public async render(): Promise<string> {
        const renderPromises: Promise<string>[] = [];

        for (let index = 0; index < this.layers.length; index++) {
            const layer = this.layers[index];
            const range = new Range(layer.range.start, layer.range.end);

            if (!Renderer.visibleRange.isShowing(range)) continue;

            const worker = new Worker(
                new URL("../utils/layerWorker.ts", import.meta.url)
            );

            const renderPromise = new Promise<string>((resolve, reject) => {
                worker.onmessage = (e: MessageEvent) => {
                    worker.terminate();
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.stringify);
                    }
                };

                worker.onerror = (e) => {
                    worker.terminate();
                    reject(new Error(`Worker error: ${e.message}`));
                };

                worker.postMessage({
                    frameNum: this.id,
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });

            renderPromises.push(renderPromise);
        }

        try {
            const renderedLayers = await Promise.all(renderPromises);
            return `<g id="frame${this.id}">${renderedLayers.join("\n")}</g>`;
        } catch (error) {
            console.error("Error rendering frame:", error);
            throw error;
        }
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
