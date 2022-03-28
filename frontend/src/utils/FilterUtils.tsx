import { bigNumberToFloat } from './StringUtils';

export const filterPositionByAccount = (
  match: string,
  dataSorted: any = [],
  initialIndex: number = 0,
  dataSize: number = 0
) => {
  let result = [];

  while (initialIndex <= dataSize) {
    let middle = Math.floor((initialIndex + dataSize) / 2);

    let currentData = dataSorted[middle].returnValues[1];
    if (currentData.account.toLowerCase() === match.toLowerCase()) {
      result.push(currentData);
    }

    if (currentData.account.toLowerCase() > match.toLowerCase()) {
      initialIndex = middle + 1;
    } else {
      dataSize = middle - 1;
    }
  }

  return result;
};
