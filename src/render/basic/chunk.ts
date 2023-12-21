import { ISvgElement } from "../svg";
import { IPoint } from "./point";

/**
 * Represents a tag associated with a Chunk.
 * @notExported
 */
type ChunkTag = "mount" | "flatmount" | "distmount" | "boat" | "water" | "?";

/**
 * Represents an interface for a Chunk.
 */
export interface IChunk extends IPoint {
    /**
     * The tag associated with the chunk.
     */
    tag: ChunkTag;
}

/**
 * Represents a chunk of terrain with SVG elements.
 */
export class Chunk implements IChunk {
    /**
     * The tag associated with the chunk.
     * @default "?"
     */
    tag: ChunkTag = "?";

    /**
     * The x-coordinate of the chunk.
     * @default 0
     */
    x: number = 0;

    /**
     * The y-coordinate of the chunk.
     * @default 0
     */
    y: number = 0;

    /**
     * The SVG elements that make up the chunk.
     * @default []
     */
    elements: ISvgElement[] = [];

    /**
     * The rendered SVG content of the chunk.
     * @default this.getSvgContent()
     */
    canvas: string = this.getSvgContent();

    /**
     * Creates an instance of Chunk.
     * @param tag - The tag associated with the chunk.
     * @param x - The x-coordinate of the chunk.
     * @param y - The y-coordinate of the chunk.
     * @param elements - The SVG elements that make up the chunk.
     */
    constructor(
        tag: ChunkTag,
        x: number = 0,
        y: number = 0,
        elements: ISvgElement[] = []
    ) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.elements = elements;
    }

    /**
     * Renders the chunk as an SVG string.
     * @returns The SVG content of the chunk.
     */
    render(): string {
        return this.canvas;
    }

    /**
     * Generates the SVG content of the chunk.
     * @returns The SVG content as a string.
     * @private
     */
    private getSvgContent(): string {
        return this.elements.map((p) => p.render()).join("\n");
    }
}

/**
 * Represents a design chunk with tag, coordinates, and height information.
 */
export class DesignChunk implements IChunk {
    /**
     * The tag associated with the design chunk.
     * @default "?"
     */
    tag: ChunkTag = "?";

    /**
     * The x-coordinate of the design chunk.
     * @default 0
     */
    x: number = 0;

    /**
     * The y-coordinate of the design chunk.
     * @default 0
     */
    y: number = 0;

    /**
     * The height information of the design chunk.
     * @default 0
     */
    height: number = 0;

    /**
     * Creates an instance of DesignChunk.
     * @param tag - The tag associated with the design chunk.
     * @param x - The x-coordinate of the design chunk.
     * @param y - The y-coordinate of the design chunk.
     * @param height - The height information of the design chunk.
     */
    constructor(tag: ChunkTag, x: number, y: number, height: number = 0) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.height = height;
    }
}
