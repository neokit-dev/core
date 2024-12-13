import type { Plugin } from '$lib/plugins.js';
import type { Handle } from '@sveltejs/kit';

declare global {
	// eslint-disable-next-line no-var
	var neokit: {
		plugins: Record<string, Record<string, Plugin>>;
		handlers: Handle[];
	};
}

// init has to be exported as this function call above will only occur in the build process
export { init } from '$lib/init.js';

export * from '$lib/plugins.js';
export * from '$lib/handle.js';