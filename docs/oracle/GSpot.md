# GSpot









## Methods

### addSsm

```solidity
function addSsm(bytes32 synth, address spot_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| synth | bytes32 | undefined |
| spot_ | address | undefined |

### oracles

```solidity
function oracles(bytes32) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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
function peek(bytes32 synthKey) external view returns (uint256, bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| synthKey | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |
| _1 | bool | undefined |

### read

```solidity
function read(bytes32 synthKey) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| synthKey | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



