import PRNG from "../classes/PRNG";
import Range from "../classes/Range";
import ChunkCache from "../classes/ChunkCache";

export interface ISettingPanel {
    seed: string;
    changeSeed: (seed: string) => void;
    reloadWindowSeed: () => void;
    horizontalScroll: (value: number) => void;
    toggleAutoScroll: (status: boolean, value: number) => void;
    currentPosition: number;
    chunkCache: ChunkCache;
    windowWidth: number;
    windowHeight: number;
    prng: PRNG;
    saveRange: Range;
    onChangeSaveRange: (r: Range) => void;
    toggleAutoLoad: (status: boolean) => void;
}
