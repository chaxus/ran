import * as MagicString from 'magic-string';
import type { Module } from './module';
import { Graph } from './graph';

interface BundleOptions {
  entry: string;
}

export class Bundle {
  graph: Graph;
  constructor(options: BundleOptions) {
    this.graph = new Graph({
      entry: options.entry,
      bundle: this
    });
  }

  async build():Promise<void> {
    await this.graph.build();
  }

  getModuleById(id: string):Module {
    return this.graph.getModuleById(id);
  }

  addModule(module: Module):void {
    return this.graph.addModule(module);
  }

  render(): { code: string; map: MagicString.SourceMap } {
    const msBundle = new MagicString.Bundle({ separator: '\n' });

    this.graph.orderedModules.forEach((module) => {
      msBundle.addSource({
        content: module.render()
      });
    });

    const map = msBundle.generateMap({ includeContent: true });
    return {
      code: msBundle.toString(),
      map
    };
  }
}
