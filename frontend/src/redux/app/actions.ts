import { Types } from './';

export const setTxSucces = (txSuccess: null | boolean) => ({
  type: Types.SET_TXSUCCESS,
  txSuccess,
});

export const setCRatio = (cRatioValue: null | string) => ({
  type: Types.SET_CRATIO,
  cRatioValue,
});

export const setCRatioSimulateMint = (
  cRatioSimulateMintValue: null | string,
  collateralBalance: null | string,
  synthDebt: null | string
) => ({
  type: Types.SET_CRATIO_SIMULATE_MINT,
  cRatioSimulateMintValue,
  collateralBalance,
  synthDebt,
});

export const setBalanceOfGHO = (balanceOfGHO: null | string) => ({
  type: Types.SET_BALANCE_OF_GHO,
  balanceOfGHO,
});

export const setBalanceOfGDAI = (balanceOfGDAI: null | string) => ({
  type: Types.SET_BALANCE_OF_GDAI,
  balanceOfGDAI,
});
