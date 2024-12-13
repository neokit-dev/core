import { isInitialized } from '$lib/init.js';
import type { Handle } from '@sveltejs/kit';

export const minApi = 2;
export const maxApi = 3;

export interface Plugin extends PluginOptionsRequired {
	id: string;
	plugin: unknown;
	version: number;
	requires?: Record<string, number[]>;
	apiVersion: number;
	onLoaded?: () => void;
}

export interface PluginOptions {
	namespace?: string;
	allowInjection?: boolean;
}

export interface PluginOptionsRequired {
	namespace: string;
	allowInjection?: boolean;
}

export function defaultPluginOptions(
	options: PluginOptions | undefined,
	defaults: PluginOptionsRequired
): PluginOptionsRequired {
	return {
		namespace: options?.namespace ?? defaults.namespace,
		allowInjection: options?.allowInjection ?? defaults.allowInjection ?? false
	};
}

export function load(...plugins: Plugin[]): void {
	if (!isInitialized()) throw new Error('NeoKit is not initialized, call init() first');
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
				const requiredPlugin =
					globalThis.neokit.plugins[required][Object.keys(globalThis.neokit.plugins[required])[0]];
				if (requiredPlugin.version < minVer || requiredPlugin.version > maxVer) {
					throw new Error(
						`Plugin ${plugin.id} requires plugin ${required} API version between ${minVer} and ${maxVer}, got ${requiredPlugin.version}`
					);
				}
			});
		}
		if (!globalThis.neokit.plugins[plugin.id]) globalThis.neokit.plugins[plugin.id] = {};
		globalThis.neokit.plugins[plugin.id][plugin.namespace] = plugin;
		if (plugin.onLoaded) plugin.onLoaded();
	});
}

export function access(id: string): Record<string, Plugin> {
	if (!isInitialized()) throw new Error('NeoKit is not initialized, call init() first');
	return globalThis.neokit.plugins[id];
}

export function registerHandler(handler: Handle): void {
	if (!isInitialized()) throw new Error('NeoKit is not initialized, call init() first');
	globalThis.neokit.handlers.push(handler);
}

export function inject(id: string, namespace: string, plugin: unknown): void {
	if (!isInitialized()) throw new Error('NeoKit is not initialized, call init() first');
	if (!globalThis.neokit.plugins[id][namespace].allowInjection) {
		throw new Error(`Plugin ${id} does not allow injection`);
	}

	globalThis.neokit.plugins[id][namespace].plugin = plugin;
}