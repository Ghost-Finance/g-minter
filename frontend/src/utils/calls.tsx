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
  return contract.methods.balanceOf(account).call((err: any, result: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
};

export const getCRatio = async (
  contract: Contract,
  token: string, // gdai
  account: string
) => {
  return contract.methods.getCRatio(token).call({ from: account });
};

export const simulateMint = async (
  contract: Contract,
  token: string,
  amountGHO: string,
  amountGdai: string
) => {
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
