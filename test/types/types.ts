type TokenDetails = {
  name: string;
  symbol: string;
};

type DepositedCollateralEvent = {
  user: string;
  collateral: number;
  collateralAddress: string;
};

type WithdrawnCollateralEvent = {
  user: string;
  collateral: number;
  collateralAddress: string;
};

type MintEvent = {
  user: string;
  value: number;
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
  DepositedCollateralEvent,
  WithdrawnCollateralEvent,
  MintEvent,
  BurnEvent,
  ChangedFinancialContractAddressEvent,
};
