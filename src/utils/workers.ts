import Element from "../classes/Element";
/**
 * Process the incoming message event and post the worker result.
 *
 * @param {MessageEvent} e - the message event containing index, layerTag, elements, and frameIndex
 * @return {void}
 */
onmessage = function (e: MessageEvent): void {
    const index = e.data.index as number;
    const layerTag = e.data.layerTag as string;
    const elements = e.data.elements as Array<Element>;

    const workerResult = `
        <g id="layer${index}-${layerTag}">
            ${elements.map((element) => element.stringify).join("\n")}"
        </g>`;

    postMessage({ stringify: workerResult });
};
