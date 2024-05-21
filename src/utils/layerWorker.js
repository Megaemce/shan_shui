/**
 * Process the incoming message event and post the worker result.
 * This utils needs to be JavaScript as the new URL("../../utils/layerWorker", import.meta.url)
 * in CustomWorker cannot translate the URL to the correct path for some strange reason.
 *
 * @param {MessageEvent} e - the message event containing index, layerTag, elements, and frameIndex
 * @return {void}
 */
onmessage = function (e) {
    const frameNum = e.data.frameNum;
    const index = e.data.index;
    const layerTag = e.data.layerTag;
    const elements = e.data.elements;

    let text = "";
    for (let i = 0; i < elements.length; i++) {
        text += elements[i].stringify + "\n";
    }

    const workerResult = `<g id="frame${frameNum}-layer${index}-${layerTag}">${text}</g>`;

    postMessage({ stringify: workerResult });
};
