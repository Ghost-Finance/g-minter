// import BigNumber from 'bignumber.js'

export const approve = async (
  spenderAddres: string,
  contract: any,
  account: string
) => {
  return contract.methods
    .approve(spenderAddres, '90000000000000000000000000000')
    .send({ from: account });
};

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

export const cRatio = async (
  token: string,
  amount: string,
  contract: any,
  account: string
) => {
  return '';
};

export const cMaxDai = async (
  token: string,
  amount: string,
  contract: any,
  account: string
) => {
  return '10000';
};

export const cMaxGho = async (
  token: string,
  amount: string,
  contract: any,
  account: string
) => {
  return '69000';
};
