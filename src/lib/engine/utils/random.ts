export type RandomFnType = typeof Math.random;
const DEFAULT_FN: RandomFnType = Math.random;

export function randomInt(min: number, max: number, fn?: RandomFnType): number {
  fn ??= DEFAULT_FN;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fn() * (max - min + 1)) + min;
}

export function rollD6(fn?: RandomFnType): number {
  return randomInt(1, 6, fn);
}
export function rollD3(fn?: RandomFnType): number {
  return randomInt(1, 3, fn);
}

export function randomChoice<T>(list: T[], fn?: RandomFnType): T {
  return list[randomInt(0, list.length - 1, fn)];
}
export function takeRandomChoice<T>(list: T[], fn?: RandomFnType): T {
  const choice = randomChoice(list, fn);
  list.splice(list.indexOf(choice), 1);
  return choice;
}
export type WeightedChoice<T> = {
  item: T;
  weight: number;
};

export function weightedRandomChoice<T>(
  choices: WeightedChoice<T>[],
  fn?: RandomFnType,
): T {
  const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let random = fn() * totalWeight;

  for (const choice of choices) {
    if (random < choice.weight) {
      return choice.item;
    }
    random -= choice.weight;
  }

  // Fallback
  return choices[choices.length - 1].item;
}

export function randomColor(
  s = 80,
  l = 80,
  cardinality = 36,
  fn?: RandomFnType,
): string {
  let h = randomInt(0, cardinality, fn) * (360 / cardinality);
  return `hsl(${h}, ${s}%, ${l}%)`;
}
