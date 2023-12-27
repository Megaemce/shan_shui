import React, { useState } from "react";
import { ButtonMenu } from "./ButtonMenu";
import { ButtonSource } from "./ButtonSource";
import { Menu } from "./Menu";
import "./styles.css";
import { ISettingPanel } from "../interfaces/ISettingPanel";

export const SettingPanel: React.FC<ISettingPanel> = ({
    seed,
    changeSeed,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    currentPosition,
    chunkCache,
    windowWidth,
    windowHeight,
    saveRange,
    onChangeSaveRange,
    toggleAutoLoad,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleVisible = () => setMenuVisible(!menuVisible);

    const left = 40;

    return (
        <div id="SETTING" style={{ left }}>
            <div id="BTN_ROW">
                <ButtonMenu
                    onClick={toggleVisible}
                    menu_visible={menuVisible}
                    left={left}
                />
                <ButtonSource />
            </div>
            <div style={{ height: 4 }} />
            {menuVisible && (
                <Menu
                    display="block"
                    seed={seed}
                    changeSeed={changeSeed}
                    reloadWindowSeed={reloadWindowSeed}
                    horizontalScroll={horizontalScroll}
                    toggleAutoScroll={toggleAutoScroll}
                    currentPosition={currentPosition}
                    chunkCache={chunkCache}
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
