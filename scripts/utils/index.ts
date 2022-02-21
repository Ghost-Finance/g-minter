import { ContractFactory } from 'ethers';

export const deployContracts = async (
  contractFactory: ContractFactory,
  ...args
) => {
  const contract = await contractFactory.deploy(...args);

  return contract;
};
