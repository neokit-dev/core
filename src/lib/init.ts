export function init() {
  if (globalThis.neokit) return;

  globalThis.neokit = {
    plugins: {},
    handlers: []
  };
}

export function isInitialized() {
  return !!globalThis.neokit;
}