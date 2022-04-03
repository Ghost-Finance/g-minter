# Minter









## Methods

### FLAG_TIP

```solidity
function FLAG_TIP() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### PENALTY_FEE

```solidity
function PENALTY_FEE() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### addDebtPool

```solidity
function addDebtPool(address debtPool_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| debtPool_ | address | undefined |

### auctionDebt

```solidity
function auctionDebt(address, contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### auctionFinish

```solidity
function auctionFinish(uint256 auctionId, address user, contract GTokenERC20 _collateralToken, contract GTokenERC20 synthToken, uint256 collateralAmount, uint256 synthAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| auctionId | uint256 | undefined |
| user | address | undefined |
| _collateralToken | contract GTokenERC20 | undefined |
| synthToken | contract GTokenERC20 | undefined |
| collateralAmount | uint256 | undefined |
| synthAmount | uint256 | undefined |

### balanceOfSynth

```solidity
function balanceOfSynth(address from, contract GTokenERC20 token) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| token | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### burn

```solidity
function burn(contract GTokenERC20 token, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |

### cRatioActive

```solidity
function cRatioActive(contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### cRatioPassive

```solidity
function cRatioPassive(contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### collateralBalance

```solidity
function collateralBalance(address, contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### collateralFeed

```solidity
function collateralFeed() external view returns (contract Feed)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Feed | undefined |

### collateralToken

```solidity
function collateralToken() external view returns (contract GTokenERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

### createSynth

```solidity
function createSynth(string name, string symbol, uint256 initialSupply, uint256 cRatioActive_, uint256 cRatioPassive_, contract Feed feed) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| name | string | undefined |
| symbol | string | undefined |
| initialSupply | uint256 | undefined |
| cRatioActive_ | uint256 | undefined |
| cRatioPassive_ | uint256 | undefined |
| feed | contract Feed | undefined |

### debtPoolBurn

```solidity
function debtPoolBurn(contract GTokenERC20 token, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |

### debtPoolMint

```solidity
function debtPoolMint(contract GTokenERC20 token, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |

### feeds

```solidity
function feeds(contract GTokenERC20) external view returns (contract Feed)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Feed | undefined |

### flagLiquidate

```solidity
function flagLiquidate(address user, contract GTokenERC20 token) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |
| token | contract GTokenERC20 | undefined |

### getCRatio

```solidity
function getCRatio(contract GTokenERC20 token, address user) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| user | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getSynth

```solidity
function getSynth(uint256 index) external view returns (contract GTokenERC20)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

### liquidate

```solidity
function liquidate(address user, contract GTokenERC20 token) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |
| token | contract GTokenERC20 | undefined |

### maximumByCollateral

```solidity
function maximumByCollateral(contract GTokenERC20 token, uint256 amount) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maximumByDebt

```solidity
function maximumByDebt(contract GTokenERC20 token, uint256 amount) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### mint

```solidity
function mint(contract GTokenERC20 token, uint256 amountToDeposit, uint256 amountToMint) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amountToDeposit | uint256 | undefined |
| amountToMint | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### plrDelay

```solidity
function plrDelay(address, contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### ratio

```solidity
function ratio() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### simulateCRatio

```solidity
function simulateCRatio(contract GTokenERC20 token, address user, uint256 amountGHO, uint256 amountGDAI) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| user | address | undefined |
| amountGHO | uint256 | undefined |
| amountGDAI | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### synthDebt

```solidity
function synthDebt(address, contract GTokenERC20) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | contract GTokenERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### synths

```solidity
function synths(uint256) external view returns (contract GTokenERC20)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

### updateSynthCRatio

```solidity
function updateSynthCRatio(contract GTokenERC20 token, uint256 cRatio_, uint256 cRatioPassivo_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| cRatio_ | uint256 | undefined |
| cRatioPassivo_ | uint256 | undefined |

### withdrawnCollateral

```solidity
function withdrawnCollateral(contract GTokenERC20 token, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token | contract GTokenERC20 | undefined |
| amount | uint256 | undefined |



## Events

### AccountFlaggedForLiquidation

```solidity
event AccountFlaggedForLiquidation(address indexed account, address indexed keeper, uint256 deadline)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| keeper `indexed` | address | undefined |
| deadline  | uint256 | undefined |

### AuctionFinish

```solidity
event AuctionFinish(uint256 indexed id, address user, uint256 finished_at)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| id `indexed` | uint256 | undefined |
| user  | address | undefined |
| finished_at  | uint256 | undefined |

### Burn

```solidity
event Burn(address indexed account, address token, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| token  | address | undefined |
| amount  | uint256 | undefined |

### CreateSynth

```solidity
event CreateSynth(address token, string name, string symbol, address feed)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token  | address | undefined |
| name  | string | undefined |
| symbol  | string | undefined |
| feed  | address | undefined |

### DepositedCollateral

```solidity
event DepositedCollateral(address indexed account, address token, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| token  | address | undefined |
| amount  | uint256 | undefined |

### Liquidate

```solidity
event Liquidate(address indexed accountLiquidated, address indexed accountFrom, address token)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| accountLiquidated `indexed` | address | undefined |
| accountFrom `indexed` | address | undefined |
| token  | address | undefined |

### Mint

```solidity
event Mint(address indexed account, uint256 totalAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| totalAmount  | uint256 | undefined |

### WithdrawnCollateral

```solidity
event WithdrawnCollateral(address indexed account, address token, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| token  | address | undefined |
| amount  | uint256 | undefined |



