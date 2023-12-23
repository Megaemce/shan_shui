/**
 * Represents the properties for the ScrollBar component.
 */
export interface IScrollBar {
    /** The unique identifier for the ScrollBar. */
    id: string;
    /** The height of the ScrollBar. */
    height: number;
    /** The function to be executed when the ScrollBar is clicked. */
    onClick: () => void;
    /** The icon to be displayed in the ScrollBar. */
    icon: string;
}
