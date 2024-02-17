import BoatLayer from "./layers/BoatLayer";
import Layer from "./Layer";
import Designer from "./Designer";
import BackgroundMountainLayer from "./layers/BackgroundMountainLayer";
import BottomMountainLayer from "./layers/BottomMountainLayer";
import ILayer from "../interfaces/ILayer";
import MiddleMountainLayer from "./layers/MiddleMountainLayer";
import PRNG from "./PRNG";
import Range from "./Range";
import WaterLayer from "./layers/WaterLayer";
import { config } from "../config";

const CHUNKWIDTH = config.ui.canvasWidth;
const DISTANT_MOUNTAIN_HEIGHT = config.cachedLayer.distantMountainHeight;
const FLAT_MOUNTAIN_FLATNESS_MAX = config.cachedLayer.flatMountainFlatness.max;
const FLAT_MOUNTAIN_FLATNESS_MIN = config.cachedLayer.flatMountainFlatness.min;
const FLAT_MOUNTAIN_HEIGHT = config.cachedLayer.flatMountainHeight;
const FLAT_MOUNTAIN_WIDTH_MAX = config.cachedLayer.flatMountainWidth.max;
const FLAT_MOUNTAIN_WIDTH_MIN = config.cachedLayer.flatMountainWidth.min;
const ZOOM = config.ui.zoom;

/**
 * Class representing a cached layer used for generating and managing layer of terrain.
 */
export default class CachedLayer {
    /** Array to store generated chunks. */
    frames: Layer[][] = [];
    /** Range representing the visible area. */
    visibleRange: Range = new Range();
    static id: number = 0;
    /**
     * Processes the generated chunk plan and adds corresponding chunks to the cache.
     * @param plan - The generated chunk plan.
     */
    private process(plan: ILayer[]): void {
        if (!this.frames[CachedLayer.id]) {
            this.frames[CachedLayer.id] = [];
        }

        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "middleMountain") {
                this.frames[CachedLayer.id].push(
                    new MiddleMountainLayer(x, y, PRNG.random(0, 2 * i))
                );
                this.frames[CachedLayer.id].push(new WaterLayer(x, y));
            } else if (tag === "bottomMountain") {
                this.frames[CachedLayer.id].push(
                    new BottomMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 2 * Math.PI),
                        FLAT_MOUNTAIN_HEIGHT,
                        PRNG.random(
                            FLAT_MOUNTAIN_WIDTH_MIN,
                            FLAT_MOUNTAIN_WIDTH_MAX
                        ),
                        PRNG.random(
                            FLAT_MOUNTAIN_FLATNESS_MIN,
                            FLAT_MOUNTAIN_FLATNESS_MAX
                        )
                    )
                );
            } else if (tag === "backgroundMoutain") {
                this.frames[CachedLayer.id].push(
                    new BackgroundMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 100),
                        DISTANT_MOUNTAIN_HEIGHT,
                        PRNG.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.frames[CachedLayer.id].push(
                    new BoatLayer(
                        x,
                        y,
                        y / 800,
                        PRNG.randomChoice([true, false])
                    )
                );
            }
        });
    }

    /**
     * Generates chunks based on the given PRNG and range.
     * @param givenRange - The range for which to generate chunks.
     */
    private generate(givenRange: Range): void {
        while (
            givenRange.right > this.visibleRange.right - CHUNKWIDTH ||
            givenRange.left < this.visibleRange.left + CHUNKWIDTH
        ) {
            let start, end;

            if (givenRange.right > this.visibleRange.right - CHUNKWIDTH) {
                start = this.visibleRange.right;
                end = this.visibleRange.right += CHUNKWIDTH;
            } else {
                start = this.visibleRange.left -= CHUNKWIDTH;
                end = this.visibleRange.left;
            }

            const plan = new Designer(start, end);
            this.process(plan.layers);
        }

        // render the chunks in the background first
        this.frames[CachedLayer.id].sort((a, b) => a.y - b.y);
        CachedLayer.id++;
    }

    /**
     * Updates the chunk cache based on the given PRNG and range.
     * @param givenRange - The range for which to update the cache.
     * @param chunkWidth - The width of each chunk (default is CHUNKWIDTH).
     */
    public update(givenRange: Range, chunkWidth: number = CHUNKWIDTH): void {
        if (
            givenRange.right + 500 > this.visibleRange.right + chunkWidth ||
            givenRange.left - 500 < this.visibleRange.left - chunkWidth
        ) {
            this.generate(givenRange);
        }
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param seed - The seed for the terrain generation.
     * @param range - The range for which to generate the SVG.
     * @param windowHeight - The height of the SVG.
     * @param chunkWidth - The width of each chunk (default is CHUNKWIDTH).
     */
    public download(
        seed: string,
        range: Range,
        windowHeight: number,
        chunkWidth: number = CHUNKWIDTH
    ): void {
        const filename: string = `${seed}-[${range.left}, ${range.right}].svg`;
        const windx: number = range.right - range.left;
        const viewbox = `${range.left} 0 ${windx / ZOOM} ${
            windowHeight / ZOOM
        }`;

        this.update(range, chunkWidth);

        const left = range.left - chunkWidth;
        const right = range.right + chunkWidth;

        const content: string = `
        <svg 
            id="SVG" 
            xmlns="http://www.w3.org/2000/svg" 
            width="${range.right - range.left}" 
            height="${windowHeight}" 
            viewBox="${viewbox}">
            <defs>
                <filter 
                    width="${windx}" 
                    height="${windowHeight}" 
                    id="roughpaper">
                        <feTurbulence 
                            type="fractalNoise" 
                            baseFrequency="0.02" 
                            numOctaves="5" 
                            result="noise">
                        </feTurbulence>
                        <feDiffuseLighting 
                            in="noise" 
                            lighting-color="#F0E7D0" 
                            surfaceScale="2" 
                            result="diffLight">
                                <feDistantLight 
                                    azimuth="45" 
                                    elevation="60">
                                </feDistantLight>
                        </feDiffuseLighting>
                </filter>
            </defs>
            <g 
                id="${CachedLayer.id}">
                    ${this.frames.forEach((frame) =>
                        frame
                            .filter(
                                (frame) => frame.x >= left && frame.x < right
                            )
                            .map((layer) => layer.stringify())
                            .join("\n")
                    )} 
                </g>
            <rect 
                id="background" 
                width="${windx}" 
                height="${windowHeight}" 
                filter="url(#roughpaper)" 
                style="mix-blend-mode:multiply">
            </rect>
        </svg>`;

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    public async render(): Promise<string> {
        const framePromises = this.frames.map((frame, i) => {
            const layerPromises = frame.map(async (layer, index) => {
                /**
                 * The Worker constructor is being called with a URL object created from a relative path and the import.meta.url.
                 * new URL("../utils/workers.ts", import.meta.url) - This constructs a full URL by resolving the relative path
                 * "../utils/workers.ts" against the base URL of the current module (import.meta.url).
                 * It's a way to ensure the worker script can be located when the code is running, no matter the environment.
                 */
                const worker = new Worker(
                    new URL("../utils/workers.ts", import.meta.url)
                );
                const result = await new Promise((resolve) => {
                    worker.onmessage = (e: MessageEvent) => {
                        resolve(e.data.stringify);
                        worker.terminate();
                    };

                    worker.postMessage({
                        elements: layer.elements,
                        layerTag: layer.tag,
                        index: index,
                        frameIndex: i,
                    });
                });
                return result;
            });
            return Promise.all(layerPromises).then((layerResults) => {
                return `<g id="frame${i}">${layerResults.join("\n")}</g>`;
            });
        });

        const framesResults = await Promise.all(framePromises);
        return framesResults.join("");
    }
}
