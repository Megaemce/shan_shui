import React from "react";
import { IButton } from "../interfaces/IButton";

export const Button: React.FC<IButton> = ({ id, title, onClick, text }) => {
    return (
        <button id={id} title={title} aria-label={title} onClick={onClick}>
            {text}
        </button>
    );
};
