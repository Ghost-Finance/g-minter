import { ethers } from 'hardhat';
import { BigNumber, Contract } from 'ethers';
import { expect } from 'chai';
import * as moment from 'moment';
import {
  AccountFlaggedForLiquidationEvent,
  AuctionHouseTakeEvent,
  CreateSynthEvent,
  BurnEvent,
  DepositedCollateralEvent,
  MintEvent,
  LiquidateEvent,
  StartAuctionHouseEvent,
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

export const checkBurnEvent = async (
  contract: Contract,
  user: string,
  token: string,
  value: BigNumber
): Promise<boolean> => {
  let burnEvent = new Promise<BurnEvent>((resolve, reject) => {
    contract.on('Burn', (sender, token, value) => {
      resolve({
        user: sender,
        token: token,
        value: value,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  const eventBurn = await burnEvent;
  expect(eventBurn.user).to.be.equal(user);
  expect(eventBurn.token).to.be.equal(token);
  expect(eventBurn.value).to.be.equal(value);

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
    contract.on('Burn', (user, token, value) => {
      resolve({
        user: user,
        token: token,
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

export const checkFlagLiquidateEvent = async (
  contract: Contract,
  account: string,
  accountKeeper: string,
  endFlagDate: string
): Promise<boolean> => {
  let accountFlaggedEvent = new Promise<AccountFlaggedForLiquidationEvent>(
    (resolve, reject) => {
      contract.on('AccountFlaggedForLiquidation', (account, keeper, end) => {
        resolve({
          account: account,
          keeper: keeper,
          endFlagDate: new Date(end * 1000).getDate().toString(),
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000);
    }
  );

  const eventFlagLiquidate = await accountFlaggedEvent;
  expect(eventFlagLiquidate.account).to.be.equal(account);
  expect(eventFlagLiquidate.keeper).to.be.equal(accountKeeper);

  return true;
};

export const checkLiquidateEvent = async (
  contractMinter: Contract,
  contractAuctionHouse: Contract,
  user: string,
  keeper: string,
  // amount: number,
  token: string,
  endDateTime: Date
): Promise<boolean> => {
  let liquidateEvent = new Promise<LiquidateEvent>((resolve, reject) => {
    contractMinter.on('Liquidate', (user, keeper, token) => {
      resolve({
        userLiquidated: user,
        keeper: keeper,
        tokenAddress: token,
      });
    });

    setTimeout(() => {
      reject(new Error('timeout'));
    }, 60000);
  });

  let startAuctionHouseEvent = new Promise<StartAuctionHouseEvent>(
    (resolve, reject) => {
      contractAuctionHouse.on(
        'Start',
        (token, keeper, collateralValue, _, endDateTime) => {
          resolve({
            token: token,
            keeper: keeper,
            collateralValue: collateralValue,
            endDateTime: new Date(endDateTime * 1000).getDate(),
          });
        }
      );

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000);
    }
  );

  const auctionHouseStart = await startAuctionHouseEvent;
  expect(auctionHouseStart.token).to.be.equal(token);
  expect(auctionHouseStart.keeper).to.be.equal(keeper);
  // expect(auctionHouseStart.endDateTime).to.be.equal(endDateTime.getDate());

  const eventLiquidate = await liquidateEvent;
  expect(eventLiquidate.userLiquidated).to.be.equal(user);
  expect(eventLiquidate.keeper).to.be.equal(keeper);
  expect(eventLiquidate.tokenAddress).to.be.equal(token);

  contractMinter.removeAllListeners();
  contractAuctionHouse.removeAllListeners();

  return true;
};

export const checkAuctionHouseTakeEvent = async (
  contract: Contract,
  keeper: string,
  receiver: string,
  totalAmount: BigNumber,
  pricePaid: BigNumber
): Promise<boolean> => {
  let eventAuctionHouseTake = new Promise<AuctionHouseTakeEvent>(
    (resolve, reject) => {
      contract.on('Take', (_, keeper, receiver, totalAmount, price, end) => {
        resolve({
          keeper: keeper,
          receiver: receiver,
          totalAmount: totalAmount,
          price: price,
        });
      });

      setTimeout(() => {
        reject(new Error('timeout'));
      }, 60000);
    }
  );

  const auctionHouseTakeEvent = await eventAuctionHouseTake;
  expect(auctionHouseTakeEvent.keeper).to.be.equal(keeper);
  expect(auctionHouseTakeEvent.receiver).to.be.equal(receiver);
  expect(auctionHouseTakeEvent.totalAmount.toString()).to.be.equal(
    totalAmount.toString()
  );
  expect(auctionHouseTakeEvent.price.toString()).to.be.equal(
    pricePaid.toString()
  );

  return true;
};
