export const minApi = 1;
export const maxApi = 1;

export interface Plugin extends PluginOptionsRequired {
	id: string;
	plugin: unknown;
	requires?: string[];
	apiVersion: number;
}

export interface PluginOptions {
	namespace?: string;
}

export interface PluginOptionsRequired {
	namespace: string;
}

export function defaultOptions(
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
			plugin.requires.forEach((required) => {
				if (!globalThis.neokit.plugins[required]) {
					throw new Error(`Plugin ${plugin.id} requires plugin ${required}`);
				}
			});
		}
		if (!globalThis.neokit.plugins[plugin.id]) globalThis.neokit.plugins[plugin.id] = {};
		globalThis.neokit.plugins[plugin.id][plugin.namespace] = plugin.plugin;
	});
}

export function access(id: string): Record<string, unknown> {
	return globalThis.neokit.plugins[id];
}
