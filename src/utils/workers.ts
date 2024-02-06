import Element from "../classes/Element";

/* eslint-disable no-restricted-globals */
self.onmessage = function (e: MessageEvent): void {
    const elements = e.data.elements as Array<Element>;
    const layerTag = e.data.layerTag as string;
    const index = e.data.index as number;
    const frameIndex = e.data.frameIndex as number;

    const workerResult = `
        <g id="frame${frameIndex}-layer${index}-${layerTag}">
            ${elements.map((element) => element.stringify).join("\n")}"
        </g>`;

    self.postMessage({ stringify: workerResult });
};
