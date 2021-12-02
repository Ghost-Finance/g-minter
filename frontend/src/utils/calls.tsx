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
  console.log(BigNumber.from(parseEther(amount)).toString());
  return contract.methods
    .depositCollateral(token, '100000000000000000000')
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
  token: string, // gdai
  account: string
) => {
  return contract.methods.getCRatio(token).call((err: any, result: any) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(result);
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
  return contract.methods
    .simulateMint(
      token,
      BigNumber.from(parseEther(amountGHO)).toString(),
      BigNumber.from(parseEther(amountGdai)).toString()
    )
    .call((err: any, result: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
};
