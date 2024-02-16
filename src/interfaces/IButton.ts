/**
 * Represents the properties for the Button component.
 *
 * @interface
 */
export interface IButton {
    /**
     * The unique id for the Button.
     *
     * @type {string}
     */
    id: string;

    /**
     * The title for the Button.
     *
     * @type {string}
     */
    title: string;

    /**
     * The height of the Button.
     *
     * @type {number}
     */
    height: number;

    /**
     * The function to be executed when the Button is clicked.
     *
     * @function
     */
    onClick: () => void;

    /**
     * The icon to be displayed in the Button.
     *
     * @type {string}
     */
    icon: string;
}
