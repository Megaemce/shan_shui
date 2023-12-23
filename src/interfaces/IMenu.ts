import PRNG from "../classes/PRNG";
import Range from "../classes/Range";
import ChunkCache from "../classes/ChunkCache";

export interface IMenu {
    display: string;
    seed: string;
    changeSeed: (seed: string) => void;
    reloadWindowSeed: () => void;
    horizontalScroll: (v: number) => void;
    toggleAutoScroll: (s: boolean, v: number) => void;
    currentPosition: number;
    windowWidth: number;
    windowHeight: number;
    chunkCache: ChunkCache;
    prng: PRNG;
    saveRange: Range;
    onChangeSaveRange: (r: Range) => void;
    toggleAutoLoad: (s: boolean) => void;
}
