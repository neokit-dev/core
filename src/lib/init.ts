export function init() {
  if (globalThis.neokit) return;

  globalThis.neokit = {
    plugins: {},
  };
}