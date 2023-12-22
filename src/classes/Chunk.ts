import { ISvgElement } from "../interfaces/ISvgElement";
import { ChunkTag } from "../types/ChunkTag";
import { IChunk } from "../interfaces/IChunk";

/**
 * Represents a chunk of terrain with SVG elements.
 */
export class Chunk implements IChunk {
    /** The tag associated with the chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the chunk. */
    x: number = 0;
    /** The y-coordinate of the chunk. */
    y: number = 0;
    /** The SVG elements that make up the chunk. */
    elements: ISvgElement[] = [];
    /** The rendered SVG content of the chunk. */
    canvas: string;

    /**
     * Creates an instance of Chunk.
     * @param tag - The tag associated with the chunk.
     * @param x - The x-coordinate of the chunk.
     * @param y - The y-coordinate of the chunk.
     * @param elements - The SVG elements that make up the chunk.
     */
    constructor(
        tag: ChunkTag = "?",
        x: number = 0,
        y: number = 0,
        elements: ISvgElement[] = []
    ) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.elements = elements;
        this.canvas = this.elements.map((p) => p.render()).join("\n");
    }

    /**
     * Renders the chunk as an SVG string.
     * @returns The SVG content of the chunk.
     */
    render(): string {
        return this.canvas;
    }
}
