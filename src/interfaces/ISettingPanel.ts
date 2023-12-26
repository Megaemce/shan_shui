import PRNG from "../classes/PRNG";
import Range from "../classes/Range";
import ChunkCache from "../classes/ChunkCache";

/**
 * Represents the properties for the SettingPanel component.
 *
 * @interface
 */
export interface ISettingPanel {
    /**
     * The seed value used in the settings.
     *
     * @type {string}
     */
    seed: string;

    /**
     * Function to change the seed value.
     *
     * @function
     * @param {string} seed - The new seed value.
     */
    changeSeed: (seed: string) => void;

    /**
     * Reloads the current URL with the new seed
     *
     * @function
     */
    reloadWindowSeed: () => void;

    /**
     * Scrolls the panel horizontally.
     *
     * @function
     * @param {number} value - The amount to scroll horizontally.
     */
    horizontalScroll: (value: number) => void;

    /**
     * Toggles auto-scrolling with a specified speed.
     *
     * @function
     * @param {boolean} status - The auto-scroll status.
     * @param {number} value - The auto-scroll speed.
     */
    toggleAutoScroll: (status: boolean, value: number) => void;

    /**
     * The current position of the panel.
     *
     * @type {number}
     */
    currentPosition: number;

    /**
     * The displayed chunk cache
     *
     * @type {ChunkCache}
     */
    chunkCache: ChunkCache;

    /**
     * The width of the panel window.
     *
     * @type {number}
     */
    windowWidth: number;

    /**
     * The height of the panel window.
     *
     * @type {number}
     */
    windowHeight: number;

    /**
     * PRNG (Pseudo-Random Number Generator) instance.
     *
     * @type {PRNG}
     */
    prng: PRNG;

    /**
     * Current range.
     *
     * @type {Range}
     */
    saveRange: Range;

    /**
     * Handles the change in the save range.
     *
     * @function
     * @param {Range} r - The new save range.
     */
    onChangeSaveRange: (r: Range) => void;

    /**
     * Toggles auto-loading state.
     *
     * @function
     * @param {boolean} status - The auto-load status.
     */
    toggleAutoLoad: (status: boolean) => void;
}
