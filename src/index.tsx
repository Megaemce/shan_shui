import React from "react";
import "./index.css";
import { App } from "./App";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);
