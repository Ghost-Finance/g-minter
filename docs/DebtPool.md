# DebtPool









## Methods

### addUpdatedHouse

```solidity
function addUpdatedHouse(address updated_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| updated_ | address | undefined |

### burn

```solidity
function burn(uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |

### getSynthDebt

```solidity
function getSynthDebt() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### mint

```solidity
function mint(uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |

### minter

```solidity
function minter() external view returns (contract Minter)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Minter | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### token

```solidity
function token() external view returns (contract GTokenERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract GTokenERC20 | undefined |

### transferFrom

```solidity
function transferFrom(address receiver, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| receiver | address | undefined |
| amount | uint256 | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateHouse

```solidity
function updateHouse() external view returns (contract UpdateHouse)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract UpdateHouse | undefined |



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



