import BoatChunk from "./chunks/BoatChunk";
import Chunk from "./Chunk";
import Designer from "./Designer";
import DistantMountainChunk from "./chunks/DistantMountainChunk";
import FlatMountainChunk from "./chunks/FlatMountainChunk";
import IChunk from "../interfaces/IChunk";
import MountainChunk from "./chunks/MountainChunk";
import PRNG from "./PRNG";
import Range from "./Range";
import WaterChunk from "./chunks/WaterChunk";
import { config } from "../config";

const CHUNKWIDTH = config.ui.canvasWidth;
const DISTANTMOUNTAINHEIGHT = config.chunkCache.distantMountainHeight;
const FLATMOUNTAINFLATNESSMAX = config.chunkCache.flatMountainFlatness.max;
const FLATMOUNTAINFLATNESSMIN = config.chunkCache.flatMountainFlatness.min;
const FLATMOUNTAINHEIGHT = config.chunkCache.flatMountainHeight;
const FLATMOUNTAINWIDTHMAX = config.chunkCache.flatMountainWidth.max;
const FLATMOUNTAINWIDTHMIN = config.chunkCache.flatMountainWidth.min;
const ZOOM = config.ui.zoom;

/**
 * Class representing a ChunkCache used for generating and managing chunks of terrain.
 */
export default class ChunkCache {
    /** Array to store generated chunks. */
    layers: Chunk[][] = [];
    /** Range representing the visible area. */
    visibleRange: Range = new Range();
    static id: number = 0;
    /**
     * Processes the generated chunk plan and adds corresponding chunks to the cache.
     * @param plan - The generated chunk plan.
     */
    private processChunk(plan: IChunk[]): void {
        if (!this.layers[ChunkCache.id]) {
            this.layers[ChunkCache.id] = [];
        }

        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "mount") {
                this.layers[ChunkCache.id].push(
                    new MountainChunk(x, y, PRNG.random(0, 2 * i))
                );
                this.layers[ChunkCache.id].push(new WaterChunk(x, y));
            } else if (tag === "flatmount") {
                this.layers[ChunkCache.id].push(
                    new FlatMountainChunk(
                        x,
                        y,
                        PRNG.random(0, 2 * Math.PI),
                        FLATMOUNTAINHEIGHT,
                        PRNG.random(FLATMOUNTAINWIDTHMIN, FLATMOUNTAINWIDTHMAX),
                        PRNG.random(
                            FLATMOUNTAINFLATNESSMIN,
                            FLATMOUNTAINFLATNESSMAX
                        )
                    )
                );
            } else if (tag === "distmount") {
                this.layers[ChunkCache.id].push(
                    new DistantMountainChunk(
                        x,
                        y,
                        PRNG.random(0, 100),
                        DISTANTMOUNTAINHEIGHT,
                        PRNG.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.layers[ChunkCache.id].push(
                    new BoatChunk(
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
    private generateChunks(givenRange: Range): void {
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
            this.processChunk(plan.regions);
        }

        // render the chunks in the background first
        this.layers[ChunkCache.id].sort((a, b) => a.y - b.y);
        ChunkCache.id++;
    }

    /**
     * Updates the chunk cache based on the given PRNG and range.
     * @param givenRange - The range for which to update the cache.
     * @param chunkWidth - The width of each chunk (default is CHUNKWIDTH).
     */
    public update(givenRange: Range, chunkWidth: number = CHUNKWIDTH): void {
        if (
            givenRange.right > this.visibleRange.right + chunkWidth ||
            givenRange.left < this.visibleRange.left - chunkWidth
        ) {
            this.generateChunks(givenRange);
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
                id="${ChunkCache.id}">
                    ${this.layers.forEach((chunks) =>
                        chunks
                            .filter(
                                (chunks) => chunks.x >= left && chunks.x < right
                            )
                            .map((chunk) => chunk.render())
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
}
