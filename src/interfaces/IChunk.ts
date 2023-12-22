import { ChunkTag } from "../types/ChunkTag";
import { IPoint } from "./IPoint";

/**
 * Represents an interface for a Chunk.
 */

export interface IChunk extends IPoint {
    tag: ChunkTag;
}
