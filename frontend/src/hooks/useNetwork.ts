import { useEffect, useState } from 'react';
import { getNetworkNameFromId } from '../utils/Network';
import { NetworkNames } from '../config/enums';

declare global {
  interface Window {
    ethereum: any | undefined;
  }
}

const useNetwork = () => {
  const [network, setNetwork] = useState(
    window?.ethereum
      ? getNetworkNameFromId(window?.ethereum?.chainId)
      : NetworkNames.UNKNOWN
  );
  console.log(`rede atual antes da mudança ${network}`);
  useEffect(() => {
    window?.ethereum?.on('chainChanged', (chainId: any) => {
      console.log('chainChanged -> ', chainId);
      debugger;
      setNetwork(getNetworkNameFromId(window?.ethereum?.chainId));
    });
  }, [network]);
  console.log(`rede atual depois da mudança ${network}`);
  return network;
};

export default useNetwork;
