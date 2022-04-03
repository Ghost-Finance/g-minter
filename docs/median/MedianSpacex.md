# MedianSpacex









## Methods

### age

```solidity
function age() external view returns (uint32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint32 | undefined |

### bar

```solidity
function bar() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### bud

```solidity
function bud(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### diss

```solidity
function diss(address[] accounts) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| accounts | address[] | undefined |

### diss

```solidity
function diss(address account) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### drop

```solidity
function drop(address account) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### kiss

```solidity
function kiss(address[] accounts) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| accounts | address[] | undefined |

### kiss

```solidity
function kiss(address account) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### lift

```solidity
function lift(address account) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### oracle

```solidity
function oracle(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### peek

```solidity
function peek() external view returns (uint256, bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |
| _1 | bool | undefined |

### poke

```solidity
function poke(MedianSpacex.FeedData[] data) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| data | MedianSpacex.FeedData[] | undefined |

### read

```solidity
function read() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### recover

```solidity
function recover(uint256 val_, uint256 age_, uint8 v, bytes32 r, bytes32 s) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| val_ | uint256 | undefined |
| age_ | uint256 | undefined |
| v | uint8 | undefined |
| r | bytes32 | undefined |
| s | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setBar

```solidity
function setBar(uint256 bar_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| bar_ | uint256 | undefined |

### slot

```solidity
function slot(uint8) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### wat

```solidity
function wat() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |



## Events

### LogMedianPrice

```solidity
event LogMedianPrice(uint256 val, uint256 age)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| val  | uint256 | undefined |
| age  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



