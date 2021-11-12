export const Types = {
  SET_TXSUCCESS: '@APP/SET_TXSUCCESS',
  SET_CRATIO: '@APP/SET_CRATIO',
  SET_CRATIO_SIMULATE_MINT: '@APP/SET_CRATIO_SIMULATE_MINT',
  SET_BALANCE_OF_GHO: '@APP/SET_BALANCE_OF_GHO',
  SET_BALANCE_OF_GDAI: '@APP/SET_BALANCE_OF_GDAI',
};

type TState = {
  txSuccess?: boolean;
  cRatioValue?: string;
  cRatioSimulateMintValue?: string;
  balanceOfGHO?: string;
  balanceOfGDAI?: string;
};

type TAction = {
  type: string;
} & TState;

const initialState: TState = {
  txSuccess: false,
  cRatioValue: '0',
  cRatioSimulateMintValue: '0',
  balanceOfGHO: '0',
  balanceOfGDAI: '0',
};

export default (state: TState = initialState, action: TAction) => {
  const {
    type,
    txSuccess,
    cRatioValue,
    cRatioSimulateMintValue,
    balanceOfGHO,
    balanceOfGDAI,
  } = action;
  switch (type) {
    case Types.SET_TXSUCCESS:
      return {
        ...state,
        txSuccess,
      };
    case Types.SET_CRATIO:
      return {
        ...state,
        cRatioValue,
      };
    case Types.SET_CRATIO_SIMULATE_MINT:
      return {
        ...state,
        cRatioSimulateMintValue,
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
