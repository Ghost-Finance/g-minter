import { ethers } from 'hardhat';

import { BigNumber, Contract } from 'ethers';
import { expect } from 'chai';
import {
  CreateSynthEvent,
  BurnEvent,
  ChangedFinancialContractAddressEvent,
  DepositedCollateralEvent,
  MintEvent,
  WithdrawnCollateralEvent,
} from '../types/types';
import { formatEther } from 'ethers/lib/utils';

export const checkCreateSynthEvent = async (
  contract: Contract,
  name: string,
  symbol: string,
  feedAddress: Contract
): Promise<boolean> => {
  let createSynthEvent = new Promise<CreateSynthEvent>((resolve, reject) => {
    contract.on('CreateSynth', (name, symbol, feed) => {
      resolve({
        name: name,
        symbol: symbol,
        feed: feed,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  const eventCreateSynth = await createSynthEvent;
  expect(eventCreateSynth.name).to.be.equal(name);
  expect(eventCreateSynth.symbol).to.be.equal(symbol);
  expect(eventCreateSynth.feed).to.be.equal(feedAddress);

  contract.removeAllListeners();

  return true;
};

export const checkDepositEvent = async (
  contract: Contract,
  receiver: string,
  tokenCollateralAddress: string,
  amountToDeposit: BigNumber
): Promise<boolean> => {
  let depositEvent = new Promise<DepositedCollateralEvent>(
    (resolve, reject) => {
      contract.on('DepositedCollateral', (user, token, amount) => {
        resolve({
          user: user,
          tokenCollateral: token,
          amount: amount,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000);
    }
  );

  const eventDeposit = await depositEvent;
  expect(eventDeposit.user).to.be.equal(receiver);
  expect(eventDeposit.tokenCollateral).to.be.equal(tokenCollateralAddress);
  expect(eventDeposit.amount).to.be.equal(amountToDeposit);

  contract.removeAllListeners();

  return true;
};

export const checkMintEvent = async (
  contract: Contract,
  sender: string,
  amount: BigNumber
): Promise<boolean> => {
  let mintEvent = new Promise<MintEvent>((resolve, reject) => {
    contract.on('Mint', (user, value) => {
      resolve({
        user: user,
        amountTotal: value,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  const eventMint = await mintEvent;
  expect(eventMint.user).to.be.equal(sender);
  expect(eventMint.amountTotal).to.be.equal(amount);

  return true;
};

export const checkWithdrawalEvent = async (
  contract: Contract,
  sender: string,
  address: string,
  collateralValue: BigNumber,
  tokenToBurn: BigNumber
): Promise<boolean> => {
  let withdrawalEvent = new Promise<WithdrawnCollateralEvent>(
    (resolve, reject) => {
      contract.on(
        'WithdrawnCollateral',
        (user, collateral, collateralAddress) => {
          resolve({
            user: user,
            collateral: collateral,
            collateralAddress: collateralAddress,
          });
        }
      );

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000);
    }
  );

  const burnEvent = new Promise<BurnEvent>((resolve, reject) => {
    contract.on('Burn', (user, value) => {
      resolve({
        user: user,
        value: value,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  const eventBurn = await burnEvent;
  console.log('Tokens burned: ', formatEther(eventBurn.value));
  expect(eventBurn.user).to.be.equal(sender);
  expect(eventBurn.value).to.be.equal(tokenToBurn);

  const eventWithdrawal = await withdrawalEvent;
  console.log('Collateral: ', formatEther(eventWithdrawal.collateral));
  expect(eventWithdrawal.user).to.be.equal(sender);
  expect(eventWithdrawal.collateral).to.be.equal(collateralValue);
  expect(eventWithdrawal.collateralAddress).to.be.equal(address);
  contract.removeAllListeners();

  return true;
};

export const checkChangedFinancialContractAddressEvent = async (
  contract: Contract,
  address: string
): Promise<boolean> => {
  let changedFinancialContractAddressEvent = new Promise<
    ChangedFinancialContractAddressEvent
  >((resolve, reject) => {
    contract.on('WithdrawnCollateral', newFinancialContractAddress => {
      resolve({
        newFinancialContractAddress: newFinancialContractAddress,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  const eventChangedFinancialContractAddress = await changedFinancialContractAddressEvent;
  expect(
    eventChangedFinancialContractAddress.newFinancialContractAddress
  ).to.be.equal(address);

  contract.removeAllListeners();

  return true;
};
