import { JsxElement } from 'typescript';
import image from '../../../assets/wallet/metamask.png';
import hooks from '../../../hooks/walletConnect';

const metamaskProvider = 'ws://localhost:7545';

export default () => {
  const { connectWallet } = hooks();
  const onClick = () => {
    connectWallet(metamaskProvider);
  };
  return {
    image,
    label: 'MetaMask',
    onClick,
  };
};
