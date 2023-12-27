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
    chunkArray: Chunk[] = [];
    /** Range representing the visible area. */
    visibleRange: Range = new Range();
    /** Array storing information about mountain coverage in each chunk. */

    /**
     * Generates chunks based on the given PRNG and range.
     * @param prng - The pseudo-random number generator.
     * @param givenRange - The range for which to generate chunks.
     */
    private generateChunks(givenRange: Range): void {
        while (
            givenRange.right > this.visibleRange.right - CHUNKWIDTH ||
            givenRange.left < this.visibleRange.left + CHUNKWIDTH
        ) {
            const [start, end] =
                givenRange.right > this.visibleRange.right - CHUNKWIDTH
                    ? [
                          this.visibleRange.right,
                          (this.visibleRange.right += CHUNKWIDTH),
                      ]
                    : [
                          (this.visibleRange.left -= CHUNKWIDTH),
                          this.visibleRange.left,
                      ];

            const plan = new Designer(start, end);
            this.processChunk(plan.regions);
        }

        // render the chunks in the background first
        this.chunkArray.sort((a, b) => a.y - b.y);
    }

    /**
     * Processes the generated chunk plan and adds corresponding chunks to the cache.
     * @param plan - The generated chunk plan.
     * @param prng - The pseudo-random number generator.
     */
    private processChunk(plan: IChunk[]): void {
        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "mount") {
                this.chunkArray.push(
                    new MountainChunk(x, y, PRNG.random(0, 2 * i))
                );
                this.chunkArray.push(new WaterChunk(x, y));
            } else if (tag === "flatmount") {
                this.chunkArray.push(
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
                this.chunkArray.push(
                    new DistantMountainChunk(
                        x,
                        y,
                        PRNG.random(0, 100),
                        DISTANTMOUNTAINHEIGHT,
                        PRNG.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.chunkArray.push(
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
     * Updates the chunk cache based on the given PRNG and range.
     * @param prng - The pseudo-random number generator.
     * @param givenRange - The range for which to update the cache.
     * @param chunkWidth - The width of each chunk (default is CHUNKWIDTH).
     */
    public update(givenRange: Range, chunkWidth: number = CHUNKWIDTH): void {
        if (
            givenRange.right > this.visibleRange.right - chunkWidth ||
            givenRange.left < this.visibleRange.left + chunkWidth
        ) {
            this.generateChunks(givenRange);
        }
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param prng - The pseudo-random number generator.
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

        const content: string = `<svg id="SVG" xmlns="http://www.w3.org/2000/svg" width="${
            range.right - range.left
        }" height="${windowHeight}" style="mix-blend-mode: 'multiply'" viewBox="${viewbox}">${this.chunkArray
            .filter((chunk) => chunk.x >= left && chunk.x < right)
            .map(
                (chunk) =>
                    `<g transform="translate(0, 0)">${chunk.render()}</g>`
            )
            .join("\n")} </svg>`;

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
