export const minApi = 2;
export const maxApi = 2;

export interface Plugin extends PluginOptionsRequired {
	id: string;
	plugin: unknown;
	version: number;
	requires?: Record<string, number[]>;
	apiVersion: number;
}

export interface PluginOptions {
	namespace?: string;
}

export interface PluginOptionsRequired {
	namespace: string;
}

export function defaultPluginOptions(
	options: PluginOptions | undefined,
	defaults: PluginOptionsRequired
): PluginOptionsRequired {
	return {
		namespace: options?.namespace ?? defaults.namespace
	};
}

export function load(...plugins: Plugin[]): void {
	plugins.forEach((plugin) => {
		if (plugin.apiVersion < minApi || plugin.apiVersion > maxApi)
			throw new Error(
				`This plugin is not compatible with this version of NeoKit. Expected Plugin API version between ${minApi} and ${maxApi}, got ${plugin.apiVersion}`
			);
		if (plugin.requires) {
			Object.keys(plugin.requires).forEach((required) => {
				const version = (plugin.requires as Record<string, number[]>)[required];
				if (!globalThis.neokit.plugins[required]) {
					throw new Error(`Plugin ${plugin.id} requires plugin ${required}`);
				}
				const minVer = version[0] ?? 0;
				const maxVer = version[1] ?? Infinity;
				const requiredPlugin = globalThis.neokit.plugins[required][Object.keys(globalThis.neokit.plugins[required])[0]];
				if (requiredPlugin.version < minVer || requiredPlugin.version > maxVer) {
					throw new Error(`Plugin ${plugin.id} requires plugin ${required} API version between ${minVer} and ${maxVer}, got ${requiredPlugin.version}`);
				}
			});
		}
		if (!globalThis.neokit.plugins[plugin.id]) globalThis.neokit.plugins[plugin.id] = {};
		globalThis.neokit.plugins[plugin.id][plugin.namespace] = plugin;
	});
}

export function access(id: string): Record<string, Plugin> {
	return globalThis.neokit.plugins[id];
}
