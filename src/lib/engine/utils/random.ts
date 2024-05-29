export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollD6(): number {
  return randomInt(1, 6);
}
export function rollD3(): number {
  return randomInt(1, 3);
}

export function randomChoice<T>(list: T[]): T {
  return list[randomInt(0, list.length - 1)];
}

export type WeightedChoice<T> = {
  item: T;
  weight: number;
};

export function weightedRandomChoice<T>(choices: WeightedChoice<T>[]): T {
  const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let random = Math.random() * totalWeight;

  for (const choice of choices) {
    if (random < choice.weight) {
      return choice.item;
    }
    random -= choice.weight;
  }

  // Fallback
  return choices[choices.length - 1].item;
}

export function randomColor(s = 80, l = 80, cardinality = 36): string {
  let h = randomInt(0, cardinality) * (360 / cardinality);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function stringToHslColor(str, s = 80, l = 80): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
