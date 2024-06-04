import React from "react";
import { IButton } from "../interfaces/IButton";

export const Button = ({ id, title, onClick, text }: IButton) => (
    <button id={id} title={title} aria-label={title} onClick={onClick}>
        {text}
    </button>
);
