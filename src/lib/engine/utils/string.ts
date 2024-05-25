export function repr(obj: any) {
  return obj.name ?? obj.id ?? obj;
}

export function titleize(str: any) {
  return String(str).replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

export function initials(str: any) {
  return String(str)
    .split(/[-\s]+/)
    .map((n) => n[0])
    .join("");
}
