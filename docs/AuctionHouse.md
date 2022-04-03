# AuctionHouse









## Methods

### auctionFinishCallback

```solidity
function auctionFinishCallback(uint256 id, contract Minter minter, address user, contract GTokenERC20 tokenCollateral, contract GTokenERC20 synthToken, uint256 collateralBalance, uint256 synthAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| id | uint256 | undefined |
| minter | contract Minter | undefined |
| user | address | undefined |
| tokenCollateral | contract GTokenERC20 | undefined |
| synthToken | contract GTokenERC20 | undefined |
| collateralBalance | uint256 | undefined |
| synthAmount | uint256 | undefined |

### auctions

```solidity
function auctions(uint256) external view returns (address user, address tokenAddress, address collateralTokenAddress, address keeperAddress, uint256 collateralBalance, uint256 collateralValue, uint256 synthAmount, uint256 auctionTarget, uint256 initialFeedPrice, address minterAddress, uint256 startTimestamp, uint256 endTimestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| user | address | undefined |
| tokenAddress | address | undefined |
| collateralTokenAddress | address | undefined |
| keeperAddress | address | undefined |
| collateralBalance | uint256 | undefined |
| collateralValue | uint256 | undefined |
| synthAmount | uint256 | undefined |
| auctionTarget | uint256 | undefined |
| initialFeedPrice | uint256 | undefined |
| minterAddress | address | undefined |
| startTimestamp | uint256 | undefined |
| endTimestamp | uint256 | undefined |

### calculateAmountToFixCollateral

```solidity
function calculateAmountToFixCollateral(uint256 debtBalance, uint256 collateral) external pure returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| debtBalance | uint256 | undefined |
| collateral | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getAuction

```solidity
function getAuction(uint256 auctionId) external view returns (struct AuctionHouse.Auction)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| auctionId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | AuctionHouse.Auction | undefined |

### price

```solidity
function price(uint256 initialPrice, uint256 duration) external pure returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| initialPrice | uint256 | undefined |
| duration | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rad

```solidity
function rad() external pure returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### radiv

```solidity
function radiv(uint256 dividend, uint256 divisor) external pure returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| dividend | uint256 | undefined |
| divisor | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### ray

```solidity
function ray() external pure returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### start

```solidity
function start(address user_, address tokenAddress_, address collateralTokenAddress_, address keeperAddress_, uint256 collateralBalance_, uint256 collateralValue_, uint256 auctionTarget_, uint256 initialFeedPrice_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user_ | address | undefined |
| tokenAddress_ | address | undefined |
| collateralTokenAddress_ | address | undefined |
| keeperAddress_ | address | undefined |
| collateralBalance_ | uint256 | undefined |
| collateralValue_ | uint256 | undefined |
| auctionTarget_ | uint256 | undefined |
| initialFeedPrice_ | uint256 | undefined |

### take

```solidity
function take(uint256 auctionId, uint256 amount, uint256 maxCollateralPrice, address receiver) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| auctionId | uint256 | undefined |
| amount | uint256 | undefined |
| maxCollateralPrice | uint256 | undefined |
| receiver | address | undefined |

### wad

```solidity
function wad() external pure returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### Start

```solidity
event Start(address indexed cdp, address indexed keeper, uint256 amount, uint256 start, uint256 end)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| cdp `indexed` | address | undefined |
| keeper `indexed` | address | undefined |
| amount  | uint256 | undefined |
| start  | uint256 | undefined |
| end  | uint256 | undefined |

### Take

```solidity
event Take(uint256 indexed id, address indexed keeper, address indexed to, uint256 amount, uint256 price, uint256 end)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| id `indexed` | uint256 | undefined |
| keeper `indexed` | address | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |
| price  | uint256 | undefined |
| end  | uint256 | undefined |



