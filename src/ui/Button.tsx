import React from "react";
import { IButton } from "../interfaces/IButton";

export const Button: React.FC<IButton> = ({ id, title, onClick, icon }) => {
    return (
        <button id={id} title={title} aria-label={title} onClick={onClick}>
            {icon}
        </button>
    );
};
