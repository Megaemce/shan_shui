import React, { useState } from "react";
import { IButton } from "../interfaces/IButton";

export const Button: React.FC<IButton> = ({
    id,
    title,
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
        <button
            id={id}
            title={title}
            aria-label={title}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`,
                height,
            }}
        >
            {icon}
        </button>
    );
};
