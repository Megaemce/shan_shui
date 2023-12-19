import { ISvgElement } from "../svg";
import { IPoint } from "./point";

/**
 * Represents a tag associated with a Chunk.
 */
type ChunkTag = "mount" | "flatmount" | "distmount" | "boat" | "water" | "?";

/**
 * Represents an interface for a Chunk.
 */
export interface IChunk extends IPoint {
    tag: ChunkTag;
}

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
    canv: string;

    /**
     * Creates an instance of Chunk.
     * @param tag - The tag associated with the chunk.
     * @param x - The x-coordinate of the chunk.
     * @param y - The y-coordinate of the chunk.
     * @param elements - The SVG elements that make up the chunk.
     */
    constructor(
        tag: ChunkTag,
        x: number,
        y: number,
        elements: ISvgElement[] = []
    ) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.elements = elements;
        this.canv = this.elements.map((p) => p.render()).join("\n");
    }

    /**
     * Renders the chunk as an SVG string.
     * @returns The SVG content of the chunk.
     */
    render(): string {
        return this.canv;
    }
}

/**
 * Represents a design chunk with tag, coordinates, and height information.
 */
export class DesignChunk implements IChunk {
    /** The tag associated with the design chunk. */
    tag: ChunkTag = "?";
    /** The x-coordinate of the design chunk. */
    x: number = 0;
    /** The y-coordinate of the design chunk. */
    y: number = 0;
    /** The height information of the design chunk. */
    h: number = 0;

    /**
     * Creates an instance of DesignChunk.
     * @param tag - The tag associated with the design chunk.
     * @param x - The x-coordinate of the design chunk.
     * @param y - The y-coordinate of the design chunk.
     * @param h - The height information of the design chunk.
     */
    constructor(tag: ChunkTag, x: number, y: number, h: number = 0) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.h = h;
    }
}
