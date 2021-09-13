import { BigNumber } from 'ethers';

type AccountFlaggedForLiquidationEvent = {
  account: string;
  keeper: string;
  endFlagDate: string;
};

type ApproveEvent = {
  to: string;
  from: string;
  amount: number;
};

type AuctionHouseTakeEvent = {
  keeper: string;
  receiver: string;
  totalAmount: BigNumber;
  price: BigNumber;
};

type BurnEvent = {
  user: string;
  value: number;
};

type CreateSynthEvent = {
  name: string;
  symbol: string;
  feed: string;
};

type DepositedCollateralEvent = {
  user: string;
  tokenCollateral: string;
  amount: number;
};

type MintEvent = {
  user: string;
  amountTotal: number;
};

type LiquidateEvent = {
  userLiquidated: string;
  keeper: string;
  tokenAddress: string;
};

type StartAuctionHouseEvent = {
  token: string;
  keeper: string;
  collateralValue: number;
  endDateTime: number;
};

type TokenDetails = {
  name: string;
  symbol: string;
};

type TransferEvent = {
  sender: string;
  receiver: string;
  amount: number;
};

type WithdrawnCollateralEvent = {
  user: string;
  collateral: number;
  collateralAddress: string;
};

export {
  AccountFlaggedForLiquidationEvent,
  ApproveEvent,
  AuctionHouseTakeEvent,
  BurnEvent,
  CreateSynthEvent,
  DepositedCollateralEvent,
  MintEvent,
  LiquidateEvent,
  StartAuctionHouseEvent,
  TokenDetails,
  TransferEvent,
  WithdrawnCollateralEvent,
};
