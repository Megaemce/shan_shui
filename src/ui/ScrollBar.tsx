import React, { useState } from "react";
import { IScrollBar } from "../interfaces/IScrollBar";

/**
 * ScrollBar component for navigation within the ScrollableCanvas.
 */
export const ScrollBar: React.FC<IScrollBar> = ({
    id,
    height,
    onClick,
    icon,
}) => {
    const [isHover, setIsHover] = useState(false);

    /**
     * Handles mouseover event to set the hover state to true.
     */
    const onMouseOver = () => setIsHover(true);

    /**
     * Handles mouseout event to set the hover state to false.
     */
    const onMouseOut = () => setIsHover(false);

    return (
        <div
            id={id}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`,
                height,
            }}
        >
            <div id={`${id}.icon`}>{icon}</div>
        </div>
    );
};
