/**
 * Represents an interface for a button set.
 *
 * @interface
 */
export default interface IButtonSet {
    /**
     * Indicates whether the menu is visible.
     *
     * @type {boolean}
     */
    menu_visible: boolean;

    /**
     * The left CSS property specifying the horizontal position of a positioned element.
     * It has no effect on non-positioned elements.
     *
     * @type {number}
     */
    left: number;

    /**
     * A function to be called when the button is clicked.
     *
     * @function
     */
    onClick: () => void;
}
