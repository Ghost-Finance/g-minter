import { useEffect } from 'react';
import Web3 from 'web3';
import { useDispatch, useSelector } from '../redux/hooks';

import {
  setAccount,
  setConnection,
  setLoadingWallet,
} from '../redux/wallet/actions';

const metamaskProvider = process?.env?.METAMASK_PROVIDER || '';
const web3 = new Web3(metamaskProvider);
const { ethereum } = (window || {}) as any;

export default () => {
  const wallet = useSelector(state => state.wallet);
  const dispatch = useDispatch();

  const changeAccount = (accounts: string[] | null): void => {
    dispatch(setAccount(accounts?.length ? accounts[0] : null));
    dispatch(setConnection(accounts?.length ? accounts?.length > 0 : false));
  };

  const listeners = () => {
    ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    ethereum.on('accountsChanged', (accounts: string[] | null) => {
      changeAccount(accounts);
    });
    ethereum.on('connect', async () => {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      changeAccount(accounts);
    });
    if (ethereum?.selectedAddress) {
      changeAccount([ethereum?.selectedAddress]);
    }
  };

  const isMetaMaskInstalled = (): boolean => {
    const { isMetaMask } = ethereum || false;
    return isMetaMask;
  };

  const connectWallet = async (provider: any) => {
    if (!isMetaMaskInstalled) return;
    if (wallet?.loadingWallet) return;
    web3.setProvider(provider);
    try {
      dispatch(setLoadingWallet(true));
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      });
      if (accounts?.length) changeAccount(accounts);
    } catch (e) {}
    dispatch(setLoadingWallet(false));
  };

  useEffect(() => {
    listeners();
  }, []);

  return {
    wallet,
    connectWallet,
  };
};
