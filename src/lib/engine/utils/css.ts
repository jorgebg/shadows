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
