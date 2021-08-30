type TokenDetails = {
  name: string;
  symbol: string;
};

type AccountFlaggedForLiquidationEvent = {
  account: string;
  endFlagDate: Number;
};

type ApproveEvent = {
  to: string;
  from: string;
  amount: number;
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

type WithdrawnCollateralEvent = {
  user: string;
  collateral: number;
  collateralAddress: string;
};

type MintEvent = {
  user: string;
  amountTotal: number;
};

export {
  AccountFlaggedForLiquidationEvent,
  ApproveEvent,
  BurnEvent,
  CreateSynthEvent,
  DepositedCollateralEvent,
  MintEvent,
  TokenDetails,
  WithdrawnCollateralEvent,
};
