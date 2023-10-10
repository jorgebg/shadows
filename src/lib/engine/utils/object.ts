export function assignDefaults(target, source) {
  Object.assign(target, { ...source, ...target });
}
