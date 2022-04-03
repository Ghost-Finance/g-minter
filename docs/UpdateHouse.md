# UpdateHouse









## Methods

### createPosition

```solidity
function createPosition(uint256 amount, bytes32 synthKey, enum UpdateHouse.Direction direction_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| synthKey | bytes32 | undefined |
| direction_ | enum UpdateHouse.Direction | undefined |

### data

```solidity
function data(uint256) external view returns (address account, enum UpdateHouse.Direction direction, enum UpdateHouse.Status status, bytes32 synth, uint256 averagePrice, uint256 lastSynthPrice, uint256 tokenAmount, uint256 synthTokenAmount, uint256 created_at, uint256 updated_at)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| account | address | undefined |
| direction | enum UpdateHouse.Direction | undefined |
| status | enum UpdateHouse.Status | undefined |
| synth | bytes32 | undefined |
| averagePrice | uint256 | undefined |
| lastSynthPrice | uint256 | undefined |
| tokenAmount | uint256 | undefined |
| synthTokenAmount | uint256 | undefined |
| created_at | uint256 | undefined |
| updated_at | uint256 | undefined |

### debtPool

```solidity
function debtPool() external view returns (contract DebtPool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract DebtPool | undefined |

### decreasePosition

```solidity
function decreasePosition(uint256 index, uint256 deltaAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |
| deltaAmount | uint256 | undefined |

### finishPosition

```solidity
function finishPosition(uint256 index) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

### getPositionFix

```solidity
function getPositionFix(enum UpdateHouse.Direction direction, uint256 synthTokenAmount, uint256 currentTokenSynthAmount, uint256 lastTokenSynthAmount) external pure returns (int256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| direction | enum UpdateHouse.Direction | undefined |
| synthTokenAmount | uint256 | undefined |
| currentTokenSynthAmount | uint256 | undefined |
| lastTokenSynthAmount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### getVault

```solidity
function getVault() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### increasePosition

```solidity
function increasePosition(uint256 index, uint256 deltaAmount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |
| deltaAmount | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setVault

```solidity
function setVault() external nonpayable
```






### spot

```solidity
function spot() external view returns (contract GSpot)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GSpot | undefined |

### token

```solidity
function token() external view returns (contract GTokenERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### vault

```solidity
function vault() external view returns (contract PositionVault)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract PositionVault | undefined |

### wad

```solidity
function wad() external pure returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### Create

```solidity
event Create(address account, UpdateHouse.PositionData data)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| data  | UpdateHouse.PositionData | undefined |

### Decrease

```solidity
event Decrease(address account, UpdateHouse.PositionData data)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| data  | UpdateHouse.PositionData | undefined |

### Finish

```solidity
event Finish(address account, enum UpdateHouse.Direction direction, enum UpdateHouse.Status status)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| direction  | enum UpdateHouse.Direction | undefined |
| status  | enum UpdateHouse.Status | undefined |

### Increase

```solidity
event Increase(address account, UpdateHouse.PositionData data)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| data  | UpdateHouse.PositionData | undefined |

### Loser

```solidity
event Loser(address account, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| amount  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Winner

```solidity
event Winner(address account, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| amount  | uint256 | undefined |



