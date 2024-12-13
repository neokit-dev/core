import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const handle: Handle = ({event, resolve}) => {
  return sequence(...globalThis.neokit.handlers)({event, resolve});
};
