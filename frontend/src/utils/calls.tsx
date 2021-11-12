import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

export const mint = async (
  token: string,
  amount: string,
  contract: any,
  account: string
) => {
  return contract.methods
    .mint(token, amount)
    .send({ from: account })
    .on('transactionHash', (tx: any) => {
      return tx.transactionHash;
    });
};

export const depositCollateral = async (
  token: string,
  amount: string,
  contract: any,
  account: string
) => {
  return contract.methods
    .depositCollateral(token, amount)
    .send({ from: account })
    .on('transactionHash', (tx: any) => {
      return tx.transactionHash;
    });
};

export const balanceOf = async (contract: any, account: string) => {
  return contract.methods.balanceOf(account).call();
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
