/**
 *  Groups object by a given key
 * @param list Array
 * @param key  String
 * @returns Object of arrays
 */
export function groupByKey<T>(list: T[], key: string) {
  return list.reduce(
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    }),
    {}
  );
}
