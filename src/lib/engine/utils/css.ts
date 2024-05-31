export function cssColor(
  color: string | number,
  saturation = 80,
  lightness = 80,
): string {
  if (typeof color == "number") {
    const hue = color;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  return color;
}
export function stringToHslColor(str, s = 80, l = 80): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
