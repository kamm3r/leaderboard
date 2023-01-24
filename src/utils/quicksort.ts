/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function quicksort<T>(arr: T[], lo: number, hi: number) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quicksort(arr, lo, p - 1);
    quicksort(arr, p + 1, hi);
  }
}

function partition<T>(arr: T[], lo: number, hi: number) {
  const pivot = arr[hi]!;
  let i = lo;

  for (let j = i; j < hi; j++) {
    if (arr[j]! <= pivot) {
      swap(arr, j, i);
      i++;
    }
  }
  swap(arr, i, hi);
  return i;
}

function swap<T>(arr: T[], a: number, b: number) {
  const temp = arr[a];
  arr[a] = arr[b]!;
  arr[b] = temp!;
}
