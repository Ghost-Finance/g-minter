import { Contract } from 'web3-eth-contract';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther, parseUnits } from '@ethersproject/units';

export const mint =
  (
    contract: Contract,
    token: string,
    amountToDeposit: string,
    amountToMint: string,
    account: string
  ) =>
  (dispatch: any) => {
    dispatch('idle');
    const depositAmount = BigNumber.from(parseEther(amountToDeposit));
    const mintAmount = BigNumber.from(parseEther(amountToMint));
    debugger;
    contract.methods
      .mint(token, depositAmount, mintAmount)
      .send({ from: account })
      .once('confirmation', () => dispatch('finish'))
      .on('error', (error: any) => dispatch('error'));
  };

export const burn =
  async (contract: Contract, token: string, amount: string, account: string) =>
  (dispatch: any) => {
    dispatch('idle');
    const burnAmount = BigNumber.from(parseEther(amount));

    return contract.methods
      .burn(token, burnAmount)
      .send({ from: account })
      .once('confirmation', () => dispatch('finish'))
      .on('error', (error: any) => dispatch('error'));
  };

export const approve =
  (contract: Contract, sender: string, account: string, amount: string) =>
  (dispatch: any) => {
    dispatch('idle');
    const bigAmount = BigNumber.from(parseEther(amount));
    return contract.methods
      .approve(account, bigAmount)
      .send({ from: sender })
      .once('sent', () => {
        dispatch('confirm');
      })
      .on('transactionHash', () => {
        dispatch('waiting');
      })
      .on('Approve', (data: any) => {
        return data;
      })
      .on('error', (error: any) => dispatch('error'));
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

export const simulateBurn = (
  contract: Contract,
  token: string,
  account: string,
  amountGdai: string
) => {
  const gdaiAmount = BigNumber.from(parseUnits(amountGdai));

  return contract.methods
    .simulateCRatio(token, BigNumber.from(parseEther('0')), gdaiAmount)
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
  ]).then((values) => {
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
  return Promise.all(allPromise).then(successCallback).catch(errorCallback);
};
