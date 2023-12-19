import React from "react";
import { useState } from "react";
import "./styles.css";

interface IProps {
    menu_visible: boolean;
    left: number;
    onClick: () => void;
}

const ButtonSet: React.FC<IProps> = ({ menu_visible, left, onClick }) => {
    const [isHover, setIsHover] = useState(false);

    const bgrColor: string = `rgba(0, 0, 0, ${isHover ? 0.1 : 0})`;
    const icon: string = menu_visible ? "✕" : "☰";

    return (
        <div
            id="SET_BTN"
            style={{ backgroundColor: bgrColor, left }}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={onClick}
            title="settings"
        >
            <div>
                <span id="SET_BTN.t" style={{ fontSize: "large" }}>
                    {" "}
                    {icon}{" "}
                </span>
            </div>
        </div>
    );
};

export default ButtonSet;
