import { Chunk } from "./Chunk";
import { IChunk } from "../interfaces/IChunk";
import { design } from "../utils/designer";
import { PRNG } from "./PRNG";
import { Range } from "./Range";
import { generateBoat } from "../parts/architectures/generateBoat";
import { generateMountain } from "../parts/mountains/generateMountains";
import { generateDistantMountain } from "../parts/mountains/generateDistantMountain";
import { generateFlatMountain } from "../parts/mountains/generateFlatMountain";
import { Water } from "../parts/Water";

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
            this.processChunk(prng, plan);
        }

        this.chunks.sort((a, b) => a.y - b.y);
    }

    /**
     * Processes the generated chunk plan and adds corresponding chunks to the cache.
     * @param plan - The generated chunk plan.
     * @param prng - The pseudo-random number generator.
     */
    private processChunk(prng: PRNG, plan: IChunk[]): void {
        plan.forEach(({ tag, x, y }, i) => {
            if (tag === "mount") {
                this.chunks.push(
                    generateMountain(prng, x, y, prng.random(0, 2 * i))
                );
                this.chunks.push(new Water(prng, x, y));
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
                        prng.randomChoice([500, 1000, 1500])
                    )
                );
            } else if (tag === "boat") {
                this.chunks.push(
                    generateBoat(
                        prng,
                        x,
                        y,
                        y / 800,
                        prng.randomChoice([true, false])
                    )
                );
            }
        });
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
            .filter((chunk) => chunk.x >= left && chunk.x < right)
            .map(
                (chunk) =>
                    `<g transform="translate(0, 0)">${chunk.render()}</g>`
            )
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
