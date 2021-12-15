import { Contract } from 'web3-eth-contract';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther, parseUnits } from '@ethersproject/units';

export const mint = async (
  contract: Contract,
  token: string,
  amountToDeposit: string,
  amountToMint: string,
  account: string
) => {
  const depositAmount = BigNumber.from(parseEther(amountToDeposit));
  const mintAmount = BigNumber.from(parseEther(amountToMint));

  return contract.methods
    .mint(token, depositAmount, mintAmount)
    .send({ from: account })
    .on('transactionHash', (tx: any) => {
      return tx.transactionHash;
    });
};

export const approve = async (
  contract: Contract,
  sender: string,
  account: string,
  amount: string
) => {
  const bigAmount = BigNumber.from(parseEther(amount));
  return contract.methods
    .approve(account, bigAmount)
    .send({ from: sender })
    .on('Approve', (data: any) => {
      return data;
    });
};

export const depositCollateral = async (
  token: string,
  amount: string,
  contract: Contract,
  account: string
) => {
  const bigAmount = BigNumber.from(parseEther(amount));
  return contract.methods
    .depositCollateral(token, bigAmount)
    .send({ from: account })
    .on('DepositedCollateral', (user: any) => {
      return user;
    });
};

export const balanceOf = async (contract: Contract, account: string) => {
  return contract.methods.balanceOf(account).call({ from: account });
};

export const getCRatio = async (
  contract: Contract,
  token: string,
  account: string
) => {
  return contract.methods.getCRatio(token).call({ from: account });
};

export const maximumByCollateral = async (
  contract: Contract,
  token: string,
  account: string,
  amount: string
) => {
  const value = BigNumber.from(parseEther(amount));
  return contract.methods
    .maximumByCollateral(token, value)
    .call({ from: account });
};

export const maximumByDebt = async (
  contract: Contract,
  token: string,
  account: string,
  amount: string
) => {
  const value = BigNumber.from(parseEther(amount));
  return contract.methods.maximumByDebt(token, value).call({ from: account });
};

export const simulateMint = async (
  contract: Contract,
  token: string,
  account: string,
  amountGHO: string,
  amountGdai: string
) => {
  return contract.methods
    .simulateCRatio(token, amountGHO, amountGdai)
    .call({ from: account });
};

export const collateralBalance = async (
  contract: Contract,
  token: string,
  account: string
) => {
  return contract.methods
    .collateralBalance(account, token)
    .call({ from: account });
};

export const synthDebt = async (
  contract: Contract,
  token: string,
  account: string
) => {
  return contract.methods.synthDebt(account, token).call({ from: account });
};

export const positionExposeData = (
  contract: Contract,
  token: string,
  account: string,
  amountGHO: string,
  amountGdai: string
) => {
  const ghoAmount = BigNumber.from(parseUnits(amountGHO)).toString();
  const gdaiAmount = BigNumber.from(parseUnits(amountGdai)).toString();

  return Promise.all([
    simulateMint(contract, token, account, ghoAmount, gdaiAmount),
    collateralBalance(contract, token, account),
    synthDebt(contract, token, account),
  ]).then(values => {
    return {
      cRatio: values[0],
      collateralBalance: values[1] + parseInt(ghoAmount),
      synthDebt: values[2] + parseInt(gdaiAmount),
    };
  });
};
