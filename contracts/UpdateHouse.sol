//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './oracle/GSpot.sol';
import './base/CoreMath.sol';
import './DebtPool.sol';
import './GTokenERC20.sol';

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

  mapping (uint => PositionData) data;

  event Add(address account, PositionData data);
  event Finish(address account, uint256 currentPrice, Direction direction);

  constructor(GTokenERC20 token_, GSpot spot_, DebtPool debtPool_) {
    // vault = vault_; // verificar com Jairzera
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

    PositionData memory dataPosition = PositionData(
      msg.sender,
      direction_,
      Status.OPEN,
      synthKey,
      initialPrice,
      0,
      amount,
      amount / initialPrice,
      block.timestamp,
      block.timestamp
    );

    data[positionCount] = dataPosition;
    positionCount++;

    emit Add(msg.sender, dataPosition);
  }

  function editPosition(bytes32 synthKey, PositionData memory data) external {}

  function finishPosition(uint index, bytes32 synthKey) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender && dataPosition.status != Status.FINISHED);
    uint256 currentPrice = spot.read(synthKey);
    require(currentPrice > 0);

    uint256 positionFixValue = (dataPosition.synthTokenAmount * currentPrice - dataPosition.synthTokenAmount * dataPosition.initialPrice);
    uint256 currentPricePosition;
    if (dataPosition.direction == Direction.LONG) {
      currentPricePosition = dataPosition.tokenAmount + positionFixValue;
    } else if (dataPosition.direction == Direction.SHORT) {
      currentPricePosition = orderToSub(dataPosition.tokenAmount, positionFixValue);
    }

    dataPosition.status = Status.FINISHED;
    dataPosition.updated_at = block.timestamp;
    data[index] = dataPosition;

    require(debtPool.update(dataPosition.tokenAmount, currentPricePosition));
    token.transferFrom(address(debtPool), address(msg.sender), currentPricePosition);

    emit Finish(msg.sender, currentPricePosition, dataPosition.direction);
  }
}
