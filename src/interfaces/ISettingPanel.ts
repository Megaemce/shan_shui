import Range from "../classes/Range";
import Renderer from "../classes/Renderer";

/**
 * Represents the properties for the SettingPanel component.
 *
 * @interface
 */
export interface ISettingPanel {
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
     * Scrolls the panel horizontally.
     *
     * @function
     * @param {number} value - The amount to scroll horizontally.
     */
    horizontalScroll: (value: number) => void;

    /**
     * Toggles auto-scrolling.
     * @function
     */
    toggleAutoScroll: () => void;

    /**
     * The new x-coordinate of the canvas.
     *
     * @type {number}
     */
    newPosition: number;

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
     */
    toggleAutoLoad: () => void;

    /**
     * Set SVG context of the main picture with the new value
     * @function
     * @param {string} svg - The SVG content.
     */
    setSvgContent: (svg: string) => void;

    /**
     * The inital seed taken when the page is loaded
     *
     * @type {string}
     */
    initalSeed: string;
}
