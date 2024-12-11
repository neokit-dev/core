import type { Plugin } from '$lib/plugins.js';

declare global {
	// eslint-disable-next-line no-var
	var neokit: {
		plugins: Record<string, Record<string, Plugin>>;
	};
}

// init has to be exported as this function call above will only occur in the build process
export { init } from '$lib/init.js';

export * from '$lib/plugins.js';