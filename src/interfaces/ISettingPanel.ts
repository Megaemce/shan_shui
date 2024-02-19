import Range from "../classes/Range";
import Renderer from "../classes/Renderer";

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
     * Reference to Renderer
     *
     * @type {Renderer}
     */
    renderer: Renderer;

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
