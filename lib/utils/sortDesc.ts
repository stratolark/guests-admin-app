import stable from 'stable';

export function sortDesc<T>(a: T, b: T) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

export function stableSortDesc<T>(data: any[]) {
  if (data.length === 0) return [];
  return stable(data, (a, b) => sortDesc<T>(b.id, a.id));
}

export function stableSortDesc2(data: { [key: string]: any }[], key: any) {
  if (data.length === 0) return [];
  return stable(data, (a, b) => sortDesc(b[key], a[key]));
}
