import "./styles.css";
import React, { useState } from "react";
import { ISettingPanel } from "../interfaces/ISettingPanel";
import { Menu } from "./Menu";
import { Divide as Hamburger } from "hamburger-react";

export const SettingPanel: React.FC<ISettingPanel> = ({
    seed,
    setSeed,
    step,
    setStep,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    currentPosition,
    cachedLayer,
    windowWidth,
    windowHeight,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const handleClick = () => {
        window.location.href = "https://github.com/Megaemce/shan_shui";
    };

    const toggleVisible = () => setMenuVisible(!menuVisible);

    return (
        <div id="SETTING">
            <div id="BTN_ROW">
                <Hamburger
                    toggled={menuVisible}
                    toggle={toggleVisible}
                    size={20}
                    duration={0.2}
                    label="Show menu"
                />
                <div
                    id="SOURCE_BTN"
                    onClick={handleClick}
                    title="Fork me on Github!"
                >
                    <div>
                        <span id="SRC_BTN.t">&lt;/&gt;</span>
                    </div>
                </div>
            </div>
            {menuVisible && (
                <Menu
                    seed={seed}
                    setSeed={setSeed}
                    step={step}
                    setStep={setStep}
                    reloadWindowSeed={reloadWindowSeed}
                    horizontalScroll={horizontalScroll}
                    toggleAutoScroll={toggleAutoScroll}
                    currentPosition={currentPosition}
                    cachedLayer={cachedLayer}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    saveRange={saveRange}
                    onChangeSaveRange={onChangeSaveRange}
                    toggleAutoLoad={toggleAutoLoad}
                />
            )}
        </div>
    );
};
