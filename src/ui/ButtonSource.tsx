import React from "react";
import { useState } from "react";
import "./styles.css";

export const ButtonSource: React.FC = () => {
    const [isHover, setIsHover] = useState(false);

    const handleMouseOver = () => setIsHover(true);
    const handleMouseOut = () => setIsHover(false);
    const handleClick = () => {
        window.location.href = "https://github.com/Megaemce/shan_shui";
    };

    const buttonStyle = {
        backgroundColor: `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`,
        left: 77,
    };

    return (
        <div
            id="SOURCE_BTN"
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
            title="Fork me on Github!"
        >
            <div>
                <span id="SRC_BTN.t">&lt;/&gt;</span>
            </div>
        </div>
    );
};
