export default function queryFilter<T>(dataArray: T[], matchItem: string): T[] {
  return dataArray.filter((obj) =>
    JSON.stringify(obj)
      .toLowerCase()
      .includes(matchItem.toString().toLowerCase())
  );
}
