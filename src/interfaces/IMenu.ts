import Range from "../classes/Range";
import Renderer from "../classes/Renderer";

/**
 * Represents an interface for a React Menu.
 *
 * @interface
 */
export interface IMenu {
    /**
     * The seed value for the menu.
     *
     * @type {string}
     */
    seed: string;

    /**
     * Changes the seed value of the menu.
     *
     * @function
     * @param {string} seed - The new seed value.
     */
    setSeed: (seed: string) => void;

    /**
     * The step value used in the settings.
     *
     * @type {number}
     */
    step: number;

    /**
     * Function to change the step value.
     *
     * @function
     * @param {number} step - The new step value.
     */
    setStep: (step: number) => void;

    /**
     * Reloads the window based on the current seed value.
     *
     * @function
     */
    reloadWindowSeed: () => void;

    /**
     * Scrolls the menu horizontally.
     *
     * @function
     * @param {number} v - The amount to scroll.
     */
    horizontalScroll: (v: number) => void;

    /**
     * Toggles auto-scrolling with a specified speed.
     *
     * @function
     * @param {boolean} s - The auto-scroll state.
     * @param {number} v - The auto-scroll speed.
     */
    toggleAutoScroll: (s: boolean, v: number) => void;

    /**
     * The current position of the menu.
     *
     * @type {number}
     */
    currentPosition: number;

    /**
     * The width of the menu window.
     *
     * @type {number}
     */
    windowWidth: number;

    /**
     * The height of the menu window.
     *
     * @type {number}
     */
    windowHeight: number;

    /**
     * Reference to renderer
     *
     * @type {Renderer}
     */
    renderer: Renderer;

    /**
     * The range for saving menu state.
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
     * @param {boolean} s - The auto-load state.
     */
    toggleAutoLoad: (s: boolean) => void;
}
