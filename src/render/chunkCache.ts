import { Chunk, IChunk } from "../render/basic/chunk";
import { design } from "../render/basic/designer";
import { PRNG } from "../render/basic/PRNG";
import { Range } from "../render/basic/range";
import { randomChoice } from "../render/basic/utils";
import { boat01 } from "../render/parts/arch";
import {
    generateDistantMountain,
    generateFlatMountain,
    mountain,
} from "../render/parts/mountain";
import { water } from "../render/parts/water";

/**
 * Class representing a ChunkCache used for generating and managing chunks of terrain.
 */
export class ChunkCache {
    /** Array to store generated chunks. */
    chunks: Chunk[] = [];
    /** Range representing the visible area. */
    visibleRange: Range = new Range();
    /** Array storing information about mountain coverage in each chunk. */
    mountainArray: number[] = [];

    /** Width of each chunk. */
    private static readonly CHUNK_WIDTH: number = 512;

    /**
     * Generates chunks based on the given PRNG and range.
     * @param prng - The pseudo-random number generator.
     * @param givenRange - The range for which to generate chunks.
     */
    private generateChunks(prng: PRNG, givenRange: Range): void {
        const chunkWidth = ChunkCache.CHUNK_WIDTH;

        while (
            givenRange.right > this.visibleRange.right - chunkWidth ||
            givenRange.left < this.visibleRange.left + chunkWidth
        ) {
            const [start, end] =
                givenRange.right > this.visibleRange.right - chunkWidth
                    ? [
                          this.visibleRange.right,
                          (this.visibleRange.right += chunkWidth),
                      ]
                    : [
                          (this.visibleRange.left -= chunkWidth),
                          this.visibleRange.left,
                      ];

            const plan: IChunk[] = design(prng, this.mountainArray, start, end);
            this.processChunk(plan, prng);
        }

        this.chunks.sort((a, b) => a.y - b.y);
    }

    /**
     * Processes the generated chunk plan and adds corresponding chunks to the cache.
     * @param plan - The generated chunk plan.
     * @param prng - The pseudo-random number generator.
     */
    private processChunk(plan: IChunk[], prng: PRNG): void {
        for (let i = 0; i < plan.length; i++) {
            const { tag, x, y } = plan[i];

            if (tag === "mount") {
                this.chunks.push(mountain(prng, x, y, prng.random(0, 2 * i)));
                this.chunks.push(water(prng, x, y, i * 2));
            } else if (tag === "flatmount") {
                this.chunks.push(
                    generateFlatMountain(
                        prng,
                        x,
                        y,
                        prng.random(0, 2 * Math.PI),
                        100,
                        prng.random(0.5, 0.7),
                        prng.random(600, 1000)
                    )
                );
            } else if (tag === "distmount") {
                this.chunks.push(
                    generateDistantMountain(
                        prng,
                        x,
                        y,
                        prng.random(0, 100),
                        150,
                        randomChoice(prng, [500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.chunks.push(
                    boat01(
                        prng,
                        x,
                        y,
                        y / 800,
                        randomChoice(prng, [true, false])
                    )
                );
            }
        }
    }

    /**
     * Updates the chunk cache based on the given PRNG and range.
     * @param prng - The pseudo-random number generator.
     * @param givenRange - The range for which to update the cache.
     * @param chunkWidth - The width of each chunk (default is CHUNK_WIDTH).
     */
    public update(
        prng: PRNG,
        givenRange: Range,
        chunkWidth: number = ChunkCache.CHUNK_WIDTH
    ): void {
        if (
            givenRange.right > this.visibleRange.right - chunkWidth ||
            givenRange.left < this.visibleRange.left + chunkWidth
        ) {
            this.generateChunks(prng, givenRange);
        }
    }

    /**
     * Downloads the terrain SVG based on the given parameters.
     * @param prng - The pseudo-random number generator.
     * @param seed - The seed for the terrain generation.
     * @param range - The range for which to generate the SVG.
     * @param windowHeight - The height of the SVG.
     * @param chunkWidth - The width of each chunk (default is CHUNK_WIDTH).
     */
    public download(
        prng: PRNG,
        seed: string,
        range: Range,
        windowHeight: number,
        chunkWidth: number = ChunkCache.CHUNK_WIDTH
    ): void {
        const filename: string = `${seed}-[${range.left}, ${range.right}].svg`;
        const windx: number = range.right - range.left;
        const zoom: number = 1.142;
        const viewbox = `${range.left} 0 ${windx / zoom} ${
            windowHeight / zoom
        }`;

        this.update(prng, range, chunkWidth);

        const left = range.left - chunkWidth;
        const right = range.right + chunkWidth;

        const content: string = `<svg id="SVG" xmlns="http://www.w3.org/2000/svg" width="${
            range.right - range.left
        }" height="${windowHeight}" style="mix-blend-mode: 'multiply'" viewBox="${viewbox}">${this.chunks
            .filter((c) => c.x >= left && c.x < right)
            .map((c) => `<g transform="translate(0, 0)">${c.render()}</g>`)
            .join("\n")} </svg>`;

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(content)
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
