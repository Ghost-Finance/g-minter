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
  balanceOfGHO?: string;
  balanceOfGDAI?: string;
  collateralBalance?: string;
  synthDebt?: string;
};

type TAction = {
  type: string;
} & TState;

const initialState: TState = {
  txSuccess: false,
  status: 'idle',
  cRatioValue: '0',
  cRatioSimulateMintValue: '0',
  balanceOfGHO: '0',
  balanceOfGDAI: '0',
  collateralBalance: '0',
  synthDebt: '0',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: TState = initialState, action: TAction) => {
  const {
    type,
    txSuccess,
    status,
    cRatioValue,
    cRatioSimulateMintValue,
    balanceOfGHO,
    balanceOfGDAI,
    collateralBalance,
    synthDebt,
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
        balanceOfGHO,
        balanceOfGDAI,
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
        balanceOfGHO,
      };
    case Types.SET_BALANCE_OF_GDAI:
      return {
        ...state,
        balanceOfGDAI,
      };
    default:
      return state;
  }
};
