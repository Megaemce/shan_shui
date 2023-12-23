/**
 * Represents the properties for the ScrollBar component.
 *
 * @interface
 */
export interface IScrollBar {
    /**
     * The unique identifier for the ScrollBar.
     *
     * @type {string}
     */
    id: string;

    /**
     * The height of the ScrollBar.
     *
     * @type {number}
     */
    height: number;

    /**
     * The function to be executed when the ScrollBar is clicked.
     *
     * @function
     */
    onClick: () => void;

    /**
     * The icon to be displayed in the ScrollBar.
     *
     * @type {string}
     */
    icon: string;
}
