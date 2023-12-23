import React, { useState } from "react";
import ButtonSet from "./ButtonSet";
import ButtonSource from "./ButtonSource";
import Menu from "./Menu";
import "./styles.css";
import { ISettingPanel } from "../interfaces/ISettingPanel";

const SettingPanel: React.FC<ISettingPanel> = ({
    seed,
    changeSeed,
    reloadWindowSeed,
    horizontalScroll,
    toggleAutoScroll,
    currentPosition,
    chunkCache,
    windowWidth,
    windowHeight,
    prng,
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
                <ButtonSet
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
                    prng={prng}
                    saveRange={saveRange}
                    onChangeSaveRange={onChangeSaveRange}
                    toggleAutoLoad={toggleAutoLoad}
                />
            )}
        </div>
    );
};

export default SettingPanel;
