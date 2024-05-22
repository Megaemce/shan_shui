const workerFunction = function () {
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
};

const code = workerFunction.toString(); // Stringifies the whole function
const mainCode = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}")); // Get everything between brackets
const blob = new Blob([mainCode], { type: "text/javascript" }); // Create a Blob containing onmessage function
const workerBlobURL = URL.createObjectURL(blob); // Create URL to Blob object

export default workerBlobURL;
