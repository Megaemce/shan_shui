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

const FRAME_WIDTH = config.ui.frameWidth;
const BACKGROUND_MOUNTAIN_HEIGHT = config.frame.backgroundMountainHeight;
const BOTTOM_MOUNTAIN_FLATNESS_MAX = config.frame.bottomMountainFlatness.max;
const BOTTOM_MOUNTAIN_FLATNESS_MIN = config.frame.bottomMountainFlatness.min;
const BOTTOM_MOUNTAIN_HEIGHT = config.frame.bottomMountainHeight;
const BOTTOM_MOUNTAIN_WIDTH_MAX = config.frame.bottomMountainWidth.max;
const BOTTOM_MOUNTAIN_WIDTH_MIN = config.frame.bottomMountainWidth.min;
const ZOOM = config.ui.zoom;

/**
 * Class representing a frame used for generating and managing layer of terrain.
 */
export default class Frame {
    /** Array to store generated frames. */
    frames: Layer[][] = [];
    /** Range representing the visible area. */
    visibleRange: Range = new Range();
    static id: number = 0;

    /**
     * Processes the generated frame plan and adds corresponding frames to the cache.
     * @param plan - The generated frame plan.
     */
    private process(plan: ILayer[]): void {
        if (!this.frames[Frame.id]) {
            this.frames[Frame.id] = [];
        }

        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "middleMountain") {
                this.frames[Frame.id].push(
                    new MiddleMountainLayer(x, y, PRNG.random(0, 2 * i))
                );
                this.frames[Frame.id].push(new WaterLayer(x, y));
            } else if (tag === "bottomMountain") {
                this.frames[Frame.id].push(
                    new BottomMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 2 * Math.PI),
                        BOTTOM_MOUNTAIN_HEIGHT,
                        PRNG.random(
                            BOTTOM_MOUNTAIN_WIDTH_MIN,
                            BOTTOM_MOUNTAIN_WIDTH_MAX
                        ),
                        PRNG.random(
                            BOTTOM_MOUNTAIN_FLATNESS_MIN,
                            BOTTOM_MOUNTAIN_FLATNESS_MAX
                        )
                    )
                );
            } else if (tag === "backgroundMountain") {
                this.frames[Frame.id].push(
                    new BackgroundMountainLayer(
                        x,
                        y,
                        PRNG.random(0, 100),
                        BACKGROUND_MOUNTAIN_HEIGHT,
                        PRNG.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.frames[Frame.id].push(
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
     * Generates frames based on the given PRNG and range.
     * @param givenRange - The range for which to generate frames.
     */
    private generate(givenRange: Range): void {
        while (
            givenRange.right > this.visibleRange.right - FRAME_WIDTH ||
            givenRange.left < this.visibleRange.left + FRAME_WIDTH
        ) {
            let start, end;

            if (givenRange.right > this.visibleRange.right - FRAME_WIDTH) {
                start = this.visibleRange.right;
                end = this.visibleRange.right += FRAME_WIDTH;
            } else {
                start = this.visibleRange.left -= FRAME_WIDTH;
                end = this.visibleRange.left;
            }

            const plan = new Designer(start, end);
            this.process(plan.layers);
        }

        // render the frames in the background first
        this.frames[Frame.id].sort((a, b) => a.y - b.y);
        Frame.id++;
    }

    /**
     * Updates the frame cache based on the given PRNG and range.
     * @param givenRange - The range for which to update the cache.
     * @param frameWidth - The width of each frame (default is FRAME_WIDTH).
     */
    public update(givenRange: Range, frameWidth: number = FRAME_WIDTH): void {
        if (
            givenRange.right + 500 > this.visibleRange.right + frameWidth ||
            givenRange.left - 500 < this.visibleRange.left - frameWidth
        ) {
            this.generate(givenRange);
        }
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param seed - The seed for the terrain generation.
     * @param range - The range for which to generate the SVG.
     * @param windowHeight - The height of the SVG.
     * @param frameWidth - The width of each frame (default is FRAME_WIDTH).
     */
    public download(
        seed: string,
        range: Range,
        windowHeight: number,
        frameWidth: number = FRAME_WIDTH
    ): void {
        const filename: string = `${seed}-[${range.left}, ${range.right}].svg`;
        const windx: number = range.right - range.left;
        const viewbox = `${range.left} 0 ${windx / ZOOM} ${
            windowHeight / ZOOM
        }`;

        this.update(range, frameWidth);

        const left = range.left - frameWidth;
        const right = range.right + frameWidth;

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
                id="${Frame.id}">
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
