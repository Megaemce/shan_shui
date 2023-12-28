import React from "react";
import PRNG from "../classes/PRNG";
import { config } from "../config";

const RESOLUTION = config.ui.resolution;

export default class Background extends React.Component {
    canvasRef = React.createRef<HTMLCanvasElement>();

    generateBackground(): string | undefined {
        const ctx = this.canvasRef.current?.getContext("2d");
        if (!ctx) return undefined;

        for (let i = 0; i < RESOLUTION / 2 + 1; i++) {
            for (let j = 0; j < RESOLUTION / 2 + 1; j++) {
                const color = PRNG.random(225, 245);
                const red = Math.round(color);
                const green = Math.round(color * 0.95);
                const blue = Math.round(color * 0.85);

                ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                ctx.fillRect(i, j, 1, 1);
                ctx.fillRect(RESOLUTION - i, j, 1, 1);
                ctx.fillRect(i, RESOLUTION - j, 1, 1);
                ctx.fillRect(RESOLUTION - i, RESOLUTION - j, 1, 1);
            }
        }
        return this.canvasRef.current?.toDataURL("image/png");
    }

    render() {
        return (
            <canvas
                id="bgcanv"
                ref={this.canvasRef}
                width={RESOLUTION}
                height={RESOLUTION}
                hidden
            />
        );
    }
}
