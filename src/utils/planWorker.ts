import BackgroundMountainLayer from "../classes/layers/BackgroundMountainLayer";
import BoatLayer from "../classes/layers/BoatLayer";
import BottomMountainLayer from "../classes/layers/BottomMountainLayer";
import Layer from "../classes/Layer";
import MiddleMountainLayer from "../classes/layers/MiddleMountainLayer";
import PRNG from "../classes/PRNG";
import { LayerType } from "../types/LayerType";

/**
 * Process the incoming message event and post the worker result.
 *
 * @param {MessageEvent} e - the message event containing index, layerTag, x and y coords
 * @return {Object} - workers serialized data will not return Layer but Object. See: https://stackoverflow.com/a/7705809
 */
onmessage = function (e: MessageEvent): void {
    const tag = e.data.tag as LayerType;
    const index = e.data.index as number;
    const x = e.data.x as number;
    const y = e.data.y as number;

    let layer: Layer | undefined;

    if (tag === "middleMountain") {
        layer = new MiddleMountainLayer(x, y, PRNG.random(0, 2 * index));
    } else if (tag === "bottomMountain") {
        layer = new BottomMountainLayer(x, y, PRNG.random(0, 2 * Math.PI));
    } else if (tag === "backgroundMountain") {
        layer = new BackgroundMountainLayer(
            x,
            y,
            PRNG.random(0, 100),
            PRNG.randomChoice([500, 1000, 1500])
        );
    } else if (tag === "boat") {
        layer = new BoatLayer(x, y, y / 800, PRNG.randomChoice([true, false]));
    } else {
        console.warn("Layer tag is outside nominal type!");
    }

    layer?.calcAndSetRange();

    postMessage({ layer: layer });
};
