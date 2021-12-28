export const Types = {
  SET_TXSUCCESS: '@APP/SET_TXSUCCESS',
  SET_STATUS: '@APP/SET_STATUS',
  SET_CRATIO: '@APP/SET_CRATIO',
  SET_CRATIO_SIMULATE_MINT: '@APP/SET_CRATIO_SIMULATE_MINT',
  SET_BALANCE_OF_GHO: '@APP/SET_BALANCE_OF_GHO',
  SET_BALANCE_OF_GDAI: '@APP/SET_BALANCE_OF_GDAI',
};

type TState = {
  txSuccess?: boolean;
  status?: 'idle' | 'pending' | 'success' | 'error';
  cRatioValue?: string;
  cRatioSimulateMintValue?: string;
  balanceOfGho?: string;
  balanceOfGdai?: string;
  collateralBalance?: string;
  synthDebt?: string;
  collateralBalancePrice?: string;
  synthDebtPrice?: string;
};

type TAction = {
  type: string;
} & TState;

const initialState: TState = {
  txSuccess: false,
  status: 'idle',
  cRatioValue: '0',
  cRatioSimulateMintValue: '0',
  balanceOfGho: '0',
  balanceOfGdai: '0',
  collateralBalance: '0',
  synthDebt: '0',
  collateralBalancePrice: '0',
  synthDebtPrice: '0',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: TState = initialState, action: TAction) => {
  const {
    type,
    txSuccess,
    status,
    cRatioValue,
    cRatioSimulateMintValue,
    balanceOfGho,
    balanceOfGdai,
    collateralBalance,
    synthDebt,
    collateralBalancePrice,
    synthDebtPrice,
  } = action;
  switch (type) {
    case Types.SET_TXSUCCESS:
      return {
        ...state,
        txSuccess,
      };
    case Types.SET_STATUS:
      return {
        ...state,
        status,
      };
    case Types.SET_CRATIO:
      return {
        ...state,
        cRatioValue,
        balanceOfGho,
        balanceOfGdai,
        collateralBalance,
        synthDebt,
        collateralBalancePrice,
        synthDebtPrice,
      };
    case Types.SET_CRATIO_SIMULATE_MINT:
      return {
        ...state,
        cRatioSimulateMintValue,
        collateralBalance,
        synthDebt,
      };
    case Types.SET_BALANCE_OF_GHO:
      return {
        ...state,
        balanceOfGho,
      };
    case Types.SET_BALANCE_OF_GDAI:
      return {
        ...state,
        balanceOfGdai,
      };
    default:
      return state;
  }
};
