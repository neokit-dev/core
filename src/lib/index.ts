import { init } from '$lib/init.js';

declare global {
	// eslint-disable-next-line no-var
	var neokit: {
		plugins: Record<string, Record<string, unknown>>;
	};
}

init();

export * as plugins from '$lib/plugins.js';