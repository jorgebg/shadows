export function repr(obj: any) {
  return obj.title ?? obj.name ?? obj.id ?? obj;
}

export function titleize(str: string) {
  return str.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}
