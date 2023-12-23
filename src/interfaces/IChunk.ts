import { ChunkTag } from "../types/ChunkTag";
/**
 * Represents an interface for a Chunk.
 */

export default interface IChunk {
    tag: ChunkTag;
    x: number;
    y: number;
}
