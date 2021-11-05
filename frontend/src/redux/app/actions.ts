import { Types } from './';

export const setTxSucces = (txSuccess: null | boolean) => ({
  type: Types.SET_TXSUCCESS,
  txSuccess,
});
