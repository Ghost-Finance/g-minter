import { useEffect, useState } from 'react';
import minterAbi from '../utils/abis/Minter.json';
import gTokenERC20Abi from '../utils/abis/GTokenERC20.json';
import useWeb3 from './useWeb3';
import contractAddress from '../contracts/contract-address.json';

const useContract = (abi: any, address: string) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address));

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address));
  }, [abi, address, web3]);

  return contract;
};

export const useMinter = () => {
  return useContract(minterAbi, contractAddress.Minter);
};

export const useERC20 = (address: string) => {
  return useContract(gTokenERC20Abi, address);
};

export default useContract;
