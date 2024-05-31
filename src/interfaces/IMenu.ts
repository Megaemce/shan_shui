import Range from "../classes/Range";
import Renderer from "../classes/Renderer";

/**
 * Represents an interface for a React Menu.
 *
 * @interface
 */
export interface IMenu {
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
     * Scrolls the menu horizontally.
     *
     * @function
     * @param {number} v - The amount to scroll.
     */
    horizontalScroll: (v: number) => void;

    /**
     * Toggles auto-scrolling.
     *
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
     * Sets the new x-coordinate of the canvas.
     * @param {number} value - The new x-coordinate.
     */
    setNewPosition: (value: number) => void;

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
     */
    toggleAutoLoad: () => void;

    /**
     * The dark mode state.
     *
     * @type {boolean}
     */
    darkMode: boolean;
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
