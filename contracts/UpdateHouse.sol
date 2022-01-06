//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './oracle/GSpot.sol';
import './base/CoreMath.sol';
import './DebtPool.sol';
import './GTokenERC20.sol';
import 'hardhat/console.sol';

contract UpdateHouse is CoreMath {

  GTokenERC20 token;
  GSpot spot;
  DebtPool debtPool;
  address staker;
  address vault;

  enum Direction{ UNSET, SHORT, LONG }
  enum Status { UNSET, OPEN, FINISHED }

  struct PositionData {
    address account;
    Direction direction;
    Status status;
    bytes32 synth;
    uint256 initialPrice; // ok
    uint256 lastPrice; // confirma spotPrice?
    uint256 tokenAmount; // ok
    uint256 synthTokenAmount;
    uint256 created_at;
    uint256 updated_at;
  }

  uint positionCount;

  mapping (uint => PositionData) public data;

  event Add(address account, PositionData data);
  event Finish(address account, uint256 currentPrice, Direction direction);

  constructor(GTokenERC20 token_, GSpot spot_, DebtPool debtPool_) {
    token = GTokenERC20(token_);
    spot = GSpot(spot_);
    debtPool = DebtPool(debtPool_);
  }

  function add(uint256 amount, bytes32 synthKey, Direction direction_) external {
    require(amount > 0, 'Invalid amount');
    require(direction_ == Direction.SHORT || direction_ == Direction.LONG, "Invalid position option");
    require(token.transferFrom(msg.sender, address(this), amount), "");

    uint256 initialPrice = spot.read(synthKey);
    require(initialPrice > 0);

    PositionData memory dataPosition = _create(msg.sender, direction_, synthKey, initialPrice, amount);

    emit Add(msg.sender, dataPosition);
  }

  // a new method finishAndOpen

  // ((saldo antigo/saldo atual)* preçoAntigo) + ((saldoNovo/saldoAtual) * preçoAtual)
  function increasePosition(uint index, uint256 deltaAmount) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender && dataPosition.status != Status.FINISHED);
    uint256 currentPrice = spot.read(dataPosition.synth);

    uint256 currentTokenAmount = dataPosition.tokenAmount + deltaAmount;
    uint256 oldPrice = (dataPosition.tokenAmount / currentTokenAmount) * dataPosition.initialPrice;
    uint256 newPrice = (deltaAmount / currentTokenAmount) * currentPrice;
    uint256 currentInitialPrice = newPrice + oldPrice;

    dataPosition.initialPrice = currentInitialPrice;
  }

  function finishPosition(uint index) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender && dataPosition.status != Status.FINISHED);
    uint256 currentPrice = spot.read(dataPosition.synth);
    require(currentPrice > 0);

    console.log("calculation data:");
    console.log(dataPosition.synthTokenAmount);
    console.log(currentPrice);
    console.log(dataPosition.synthTokenAmount);
    console.log(dataPosition.initialPrice);
    uint256 positionFixValue = (dataPosition.synthTokenAmount * currentPrice - dataPosition.synthTokenAmount * dataPosition.initialPrice);
    uint256 currentPricePosition;
    console.log("calculation here:");
    console.log(positionFixValue);
    if (dataPosition.direction == Direction.LONG) {
      currentPricePosition = dataPosition.tokenAmount + positionFixValue;
    } else if (dataPosition.direction == Direction.SHORT) {
      currentPricePosition = orderToSub(dataPosition.tokenAmount, positionFixValue);
    }

    console.log(currentPricePosition);
    dataPosition.status = Status.FINISHED;
    dataPosition.updated_at = block.timestamp;
    data[index] = dataPosition;

    require(debtPool.update(dataPosition.tokenAmount, currentPricePosition));
    token.transferFrom(address(debtPool), address(msg.sender), currentPricePosition);

    emit Finish(msg.sender, currentPricePosition, dataPosition.direction);
  }

  function _create(address account, Direction direction, bytes32 synthKey, uint256 initialPrice, uint256 amount) internal returns (PositionData memory) {
    PositionData memory dataPosition = PositionData(
      address(account),
      direction,
      Status.OPEN,
      synthKey,
      initialPrice,
      0,
      amount,
      uint(amount) / uint(initialPrice) * 10**64,
      block.timestamp,
      block.timestamp
    );

    data[positionCount] = dataPosition;
    positionCount++;

    return dataPosition;
  }
}
