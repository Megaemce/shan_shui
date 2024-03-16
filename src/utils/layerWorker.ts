import Element from "../classes/Element";
/**
 * Process the incoming message event and post the worker result.
 *
 * @param {MessageEvent} e - the message event containing index, layerTag, elements, and frameIndex
 * @return {void}
 */
onmessage = function (e: MessageEvent): void {
    const frameNum = e.data.frameNum as number;
    const index = e.data.index as number;
    const layerTag = e.data.layerTag as string;
    const elements = e.data.elements as Array<Element>;

    let text = "";
    for (let i = 0; i < elements.length; i++) {
        text += elements[i].stringify + "\n";
    }

    const workerResult = `<g id="frame${frameNum}-layer${index}-${layerTag}">${text}</g>`;

    postMessage({ stringify: workerResult });
};
