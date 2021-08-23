type TokenDetails = {
  name: string;
  symbol: string;
};

type ApproveEvent = {
  to: string;
  from: string;
  amount: number;
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

type BurnEvent = {
  user: string;
  value: number;
};

type ChangedFinancialContractAddressEvent = {
  newFinancialContractAddress: string;
};

export {
  TokenDetails,
  ApproveEvent,
  CreateSynthEvent,
  DepositedCollateralEvent,
  WithdrawnCollateralEvent,
  MintEvent,
  BurnEvent,
  ChangedFinancialContractAddressEvent,
};
