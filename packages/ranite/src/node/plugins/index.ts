import { esbuildTransformPlugin } from "./esbuild";
import { resolvePlugin } from "./resolve";
import { importAnalysisPlugin } from "./importAnalysis";
import { Plugin } from "../plugin";
import { cssPlugin } from "./css";
import { assetPlugin } from "./assets";
import { clientInjectPlugin } from "./clientInject";
import { reactHMRPlugin } from "./react-hmr";

export function resolvePlugins(): Plugin[] {
  return [
    clientInjectPlugin(),
    resolvePlugin(),
    esbuildTransformPlugin(),
    reactHMRPlugin(),
    importAnalysisPlugin(),
    cssPlugin(),
    assetPlugin(),
  ];
}
