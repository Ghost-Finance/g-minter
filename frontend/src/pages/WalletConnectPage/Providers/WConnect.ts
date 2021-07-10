import { JsxElement } from 'typescript';
import WalletConnectProvider from '@walletconnect/web3-provider';
import image from '../../../assets/wallet/walletconnect.png';
import hooks from '../../../hooks/walletConnect';

const wConnectProvider = new WalletConnectProvider({
  infuraId: 'ad00fd516c774c208f606b37cf984a3b',
});

export default () => {
  const { connectWallet } = hooks();
  const onClick = () => {
    connectWallet(wConnectProvider);
  };

  return {
    image,
    label: 'WalletConnect',
    onClick,
  };
};
