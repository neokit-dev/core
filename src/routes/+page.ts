import { plugins } from '$lib/index.js';

// Plugin test 1
const defaultNamespace = 'example';
const id = 'dev.neokit.example';

class MyPlugin {
	customProperty: string;

	constructor(options?: MyPluginOptions) {
		this.customProperty = options?.customProperty ?? 'world';
	}

	hello() {
		return `Hello, ${this.customProperty}!`;
	}
}

interface MyPluginOptions extends plugins.PluginOptions {
	customProperty?: string;
}

function plugin(options?: MyPluginOptions): plugins.Plugin {
	return {
		id,
		plugin: new MyPlugin(options),
    apiVersion: 1,
		...plugins.defaultOptions(options, { namespace: defaultNamespace })
	};
}

function hello() {
	return (plugins.access(id)[defaultNamespace] as MyPlugin).hello();
}

function namespace(namespace: string) {
	return plugins.access(id)[namespace] as MyPlugin;
}

plugins.load(plugin(), plugin({ customProperty: 'NeoKit', namespace: 'neokit' }));

// Plugin test 2
const defaultNamespace2 = 'example2';
const id2 = 'dev.neokit.example2';

function plugin2(options?: plugins.PluginOptions): plugins.Plugin {
	return {
		id: id2,
		plugin: undefined,
    apiVersion: 1,
		...plugins.defaultOptions(options, { namespace: defaultNamespace2 }),
    requires: [id]
	};
}

const plugin2Load = (() => {
  try {
    plugins.load(plugin2());
    return 'everything is fine';
  } catch (error) {
    return (error as Error).toString();
  }
})();

// Plugin test 3
const defaultNamespace3 = 'example3';
const id3 = 'dev.neokit.example3';

function plugin3(options?: plugins.PluginOptions): plugins.Plugin {
	return {
		id: id3,
		plugin: undefined,
    apiVersion: 1,
		...plugins.defaultOptions(options, { namespace: defaultNamespace3 }),
    requires: [id3] // This will fail because it requires itself
	};
}

const plugin3Load = (() => {
  try {
    plugins.load(plugin3(), plugin3());
    return 'everything is fine';
  } catch (error) {
    return (error as Error).toString();
  }
})();

// Plugin test 4
const defaultNamespace4 = 'example4';
const id4 = 'dev.neokit.example4';

function plugin4(options?: plugins.PluginOptions): plugins.Plugin {
  return {
    id: id4,
    plugin: undefined,
    apiVersion: 0, // This will fail because the API version is too low
    ...plugins.defaultOptions(options, { namespace: defaultNamespace4 }),
  };
}

const plugin4Load = (() => {
  try {
    plugins.load(plugin4());
    return 'everything is fine';
  } catch (error) {
    return (error as Error).toString();
  }
})();

export function load() {
  console.log(globalThis.neokit.plugins['dev.neokit.example'].neokit);

  return {
    pluginTestResults: {
      hello: hello(),
      neokit: namespace('neokit').hello()
    },
    pluginTest2Results: plugin2Load,
    pluginTest3Results: plugin3Load,
    pluginTest4Results: plugin4Load
  }
}
