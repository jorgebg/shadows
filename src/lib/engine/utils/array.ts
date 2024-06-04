export function fillArray<T>(length: number, item?: T): T[] {
  return new Array(Math.trunc(length)).fill(item);
}

export function padArray<T>(length: number, array: T[]): T[] {
  while (array.length < length) {
    array.push(undefined);
  }
  return array;
}
