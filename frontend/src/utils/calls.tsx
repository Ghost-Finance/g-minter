import { Contract } from 'web3-eth-contract';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther, parseUnits } from '@ethersproject/units';
import { promises } from 'dns';

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

export const burn = async (
  contract: Contract,
  token: string,
  amount: string,
  account: string
) => {
  const burnAmount = BigNumber.from(parseEther(amount));

  return contract.methods
    .burn(token, burnAmount)
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
  return contract.methods.balanceOf(account).call();
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

export const feedPrice = async (contract: Contract) => {
  return contract.methods.price().call();
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

export const synthDebtOf = async (
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
  const ghoAmount = BigNumber.from(parseUnits(amountGHO));
  const gdaiAmount = BigNumber.from(parseUnits(amountGdai));

  return Promise.all([
    simulateMint(
      contract,
      token,
      account,
      ghoAmount.toString(),
      gdaiAmount.toString()
    ),
    collateralBalance(contract, token, account),
    synthDebtOf(contract, token, account),
  ]).then(values => {
    return {
      cRatio: values[0].toString(),
      collateralBalance: BigNumber.from(values[1]).add(ghoAmount),
      synthDebt: BigNumber.from(values[2]).add(gdaiAmount),
    };
  });
};

export const promiseAll = async (
  allPromise: any,
  successCallback: any,
  errorCallback: any
) => {
  return Promise.all(allPromise)
    .then(successCallback)
    .catch(errorCallback);
};
