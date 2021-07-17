export const Types = {
  SET_CONNECTION: '@WALLET/SET_CONNECTION',
  SET_LOADING_WALLET: '@WALLET/SET_LOADING_WALLET',
  SET_ACCOUNT: '@WALLET/SET_ACCOUNT',
};

type TState = {
  connected?: boolean;
  loaded?: boolean;
  loadingWallet?: boolean;
  account?: string | null;
};

type TAction = {
  type: string;
} & TState;

const initialState: TState = {
  connected: false,
  loaded: false,
  loadingWallet: false,
  account: null,
};

export default (state: TState = initialState, action: TAction) => {
  const { type, connected, loadingWallet, account } = action;
  switch (type) {
    case Types.SET_CONNECTION:
      return {
        ...state,
        connected,
      };
    case Types.SET_LOADING_WALLET:
      return {
        ...state,
        loadingWallet,
      };
    case Types.SET_ACCOUNT:
      return {
        ...state,
        account,
      };
    default:
      return state;
  }
};
