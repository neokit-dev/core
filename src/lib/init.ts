export function init() {
  if (globalThis.neokit) return;

  globalThis.neokit = {
    plugins: {},
  };
}

export function isInitialized() {
  return !!globalThis.neokit;
}