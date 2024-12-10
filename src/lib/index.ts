import { init } from '$lib/init.js';
import type { Plugin } from '$lib/plugins.js';

declare global {
	// eslint-disable-next-line no-var
	var neokit: {
		plugins: Record<string, Record<string, Plugin>>;
	};
}

init();

export * from '$lib/plugins.js';