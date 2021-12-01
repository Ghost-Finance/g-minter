import { Contract } from 'web3-eth-contract';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

export const mint = async (
  token: string,
  amount: string,
  contract: Contract,
  account: string
) => {
  const bigAmount = BigNumber.from(parseEther(amount));
  return contract.methods
    .mint(token, bigAmount)
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
      console.log(data);
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
  console.log(token);
  console.log(bigAmount.toString());
  return contract.methods
    .depositCollateral(token, bigAmount)
    .send({ from: account })
    .on('DepositedCollateral', (user: any) => {
      return user;
    });
};

export const balanceOf = async (contract: any, account: string) => {
  return contract.methods.balanceOf(account).call((err: any, result: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
};

export const getCRatio = async (
  contract: any,
  token: string,
  account: string
) => {
  return contract.methods.getCRatio(token).call((err: any, result: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
};

export const simulateMint = async (
  contract: any,
  token: string,
  amountGHO: string,
  amountGdai: string,
  account: string
) => {
  console.log(amountGHO);
  console.log(amountGdai);
  return contract.methods
    .simulateMint(
      token,
      BigNumber.from(parseEther(amountGHO)),
      BigNumber.from(parseEther(amountGdai))
    )
    .call((err: any, result: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
};
