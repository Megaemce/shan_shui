import Layer from "./Layer";
import PRNG from "./PRNG";
import Range from "./Range";
import Renderer from "./Renderer";
import SketchLayer from "./SketchLayer";
import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BoatLayer from "./layers/BoatLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** keeping the active layers within the frame. */
    layers: Layer[] = [];

    constructor(public id: number) {}

    /**
     * Create active layers based on the given plan and adds it to Frame.layers
     * @param {SketchLayer} - plan created by the designer
     */
    public async addSketchToLayers({ tag, x, y }: SketchLayer): Promise<void> {
        return new Promise((resolve) => {
            let layer: Layer | undefined = undefined;

            if (tag === "middleMountain") {
                layer = new MiddleMountainLayer(
                    x,
                    y,
                    PRNG.random(0, 2 * this.id)
                );
            } else if (tag === "bottomMountain") {
                layer = new BottomMountainLayer(
                    x,
                    y,
                    PRNG.random(0, 2 * Math.PI)
                );
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
            }

            if (layer) {
                this.layers.push(layer);
                resolve();
            }
        });
    }

    /**
     * Renders the frame into an SVG string using web workers.
     * @returns {Promise<string>}
     */
    public async render(): Promise<string> {
        const renderedLayers: string[] = [];

        for (let index = 0; index < this.layers.length; index++) {
            const layer = this.layers[index];

            if (!Renderer.visibleRange.isShowing(layer.range)) continue;

            const worker = new Worker(
                new URL("../utils/layerWorker.ts", import.meta.url)
            );

            const result = await new Promise<string>((resolve) => {
                worker.onmessage = (e: MessageEvent) => {
                    worker.terminate();
                    resolve(e.data.stringify);
                };

                worker.postMessage({
                    frameNum: this.id,
                    elements: layer.elements,
                    layerTag: layer.tag,
                    index: index,
                });
            });

            renderedLayers.push(result);
        }

        return `<g id="frame${this.id}">${renderedLayers.join("\n")}</g>`;
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
