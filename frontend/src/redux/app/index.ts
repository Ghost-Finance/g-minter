export const Types = {
  SET_TXSUCCESS: '@APP/SET_TXSUCCESS',
};

type TState = {
  txSuccess?: boolean;
};

type TAction = {
  type: string;
} & TState;

const initialState: TState = {
  txSuccess: false,
};

export default (state: TState = initialState, action: TAction) => {
  const { type, txSuccess } = action;
  switch (type) {
    case Types.SET_TXSUCCESS:
      return {
        ...state,
        txSuccess,
      };
    default:
      return state;
  }
};
