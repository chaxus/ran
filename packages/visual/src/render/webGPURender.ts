import type { IApplicationOptions } from "../types";
import { Renderer } from "./render";


export class WebGPURenderer extends Renderer {
    constructor(options: IApplicationOptions) {
        super(options);
    }

    render(): void {
        // Implement WebGL rendering logic here
    }
}