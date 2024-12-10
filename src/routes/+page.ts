import {
	type PluginOptions,
	type Plugin,
	defaultPluginOptions,
	access,
	load as loadPlugin
} from '$lib/index.js';

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

interface MyPluginOptions extends PluginOptions {
	customProperty?: string;
}

function plugin(options?: MyPluginOptions): Plugin {
	return {
		id,
		version: 1,
		plugin: new MyPlugin(options),
		apiVersion: 2,
		...defaultPluginOptions(options, { namespace: defaultNamespace })
	};
}

function hello() {
	return (access(id)[defaultNamespace].plugin as MyPlugin).hello();
}

function namespace(namespace: string) {
	return access(id)[namespace].plugin as MyPlugin;
}

loadPlugin(plugin(), plugin({ customProperty: 'NeoKit', namespace: 'neokit' }));

// Plugin test 2
const defaultNamespace2 = 'example2';
const id2 = 'dev.neokit.example2';

function plugin2(options?: PluginOptions): Plugin {
	return {
		id: id2,
		version: 1,
		plugin: undefined,
		apiVersion: 2,
		...defaultPluginOptions(options, { namespace: defaultNamespace2 }),
		requires: {
			[id]: [1]
		}
	};
}

const plugin2Load = (() => {
	try {
		loadPlugin(plugin2());
		return 'everything is fine';
	} catch (error) {
		return (error as Error).toString();
	}
})();

// Plugin test 3
const defaultNamespace3 = 'example3';
const id3 = 'dev.neokit.example3';

function plugin3(options?: PluginOptions): Plugin {
	return {
		id: id3,
		version: 1,
		plugin: undefined,
		apiVersion: 2,
		...defaultPluginOptions(options, { namespace: defaultNamespace3 }),
		requires: { [id3]: [1] } // This will fail because it requires itself
	};
}

const plugin3Load = (() => {
	try {
		loadPlugin(plugin3(), plugin3());
		return 'everything is fine';
	} catch (error) {
		return (error as Error).toString();
	}
})();

// Plugin test 4
const defaultNamespace4 = 'example4';
const id4 = 'dev.neokit.example4';

function plugin4(options?: PluginOptions): Plugin {
	return {
		id: id4,
		version: 1,
		plugin: undefined,
		apiVersion: 0, // This will fail because the API version is too low
		...defaultPluginOptions(options, { namespace: defaultNamespace4 })
	};
}

const plugin4Load = (() => {
	try {
		loadPlugin(plugin4());
		return 'everything is fine';
	} catch (error) {
		return (error as Error).toString();
	}
})();

// Plugin test 5
const defaultNamespace5 = 'example5';
const id5 = 'dev.neokit.example5';

function plugin5(options?: PluginOptions): Plugin {
	return {
		id: id5,
		version: 1,
		plugin: undefined,
		apiVersion: 2,
		...defaultPluginOptions(options, { namespace: defaultNamespace5 }),
		requires: { [id]: [2, 7] } // This will fail because the required plugin's version is too low
	};
}

const plugin5Load = (() => {
	try {
		loadPlugin(plugin5());
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
		pluginTest4Results: plugin4Load,
		pluginTest5Results: plugin5Load
	};
}
