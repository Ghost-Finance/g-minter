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

  enum Position{ UNSET, SHORT, LONG, FINISHED }

  struct PositionData {
    address account;
    Position position;
    bytes32 synth;
    uint256 initialPrice;
    uint256 lastPrice;
    uint256 tokenAmount;
  }

  uint positionCount;

  mapping (uint => PositionData) data;

  event Add(address account, PositionData data);
  event Finish(address account, uint256 currentPrice, Position position);

  constructor(GTokenERC20 token_, GSpot spot_, DebtPool debtPool_) {
    // staker = staker_;
    // vault = vault_; // verificar com Jairzera
    token = GTokenERC20(token_);
    spot = GSpot(spot_);
    debtPool = DebtPool(debtPool_);
  }

  function add(uint256 amount, bytes32 synthKey, Position position_) external {
    require(amount > 0, 'Invalid amount');
    require(position_ == Position.SHORT || position_ == Position.LONG, "Invalid position option");
    require(token.transferFrom(msg.sender, address(this), amount), "");

    uint256 price = spot.read(synthKey);
    require(price > 0);

    PositionData memory dataPosition = PositionData(
      msg.sender,
      position_,
      synthKey,
      price,
      0,
      amount
    );

    data[positionCount] = dataPosition;
    positionCount++;

    emit Add(msg.sender, dataPosition);
  }

  function editPosition(bytes32 synthKey, PositionData memory data) external {}

  function finishPosition(uint index, bytes32 synthKey) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender);
    uint256 price = spot.read(synthKey);
    require(price > 0);

    uint256 p = (dataPosition.tokenAmount * price - dataPosition.tokenAmount * dataPosition.initialPrice);
    uint256 currentPricePosition;
    if (dataPosition.position == Position.LONG) {
      currentPricePosition = dataPosition.tokenAmount + p;
    } else if (dataPosition.position == Position.SHORT) {
      currentPricePosition = orderToSub(dataPosition.tokenAmount, p);
    }
    dataPosition.position = Position.FINISHED;
    require(debtPool.update(dataPosition.tokenAmount, currentPricePosition));
    token.transferFrom(address(debtPool), address(msg.sender), currentPricePosition);

    emit Finish(msg.sender, currentPricePosition, dataPosition.position);
  }
}
