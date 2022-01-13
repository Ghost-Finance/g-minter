import { JsxElement } from 'typescript';
import WalletConnectProvider from '@walletconnect/web3-provider';
import image from '../../../assets/wallet/walletconnect.png';
import hooks from '../../../hooks/walletConnect';

const { INFURA_PROJECT_ID } = process.env;

const wConnectProvider = new WalletConnectProvider({
  infuraId: INFURA_PROJECT_ID,
  qrcode: true,
});

export default () => {
  const { connectWallet } = hooks();
  const onClick = async () => {
    await wConnectProvider.enable();
    await connectWallet(wConnectProvider);
  };

  return {
    image,
    label: 'WalletConnect',
    onClick,
  };
};
