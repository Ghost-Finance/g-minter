//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './oracle/GSpot.sol';
import './oracle/GSpot.sol';

contract UpdateHouse {

  GTokenERC20 constant token;
  address constant staker;
  address constant vault;

  enum Position{ UNSET, SHORT, LONG, FINISHED }

  struct PositionData {
    address account;
    Position position;
    string  synth;
    uint256 initialPrice;
    uint256 lastPrice;
    uint256 gdaiFixedAmount;
  }

  uint positionCount;

  mapping (uint => PositionData) data;

  event Add(address account, PositionData position);
  event Drop(address account, PositionData position, uint256 price);

  constructor(GTokenERC20 token_, address staker_, address vault_, address spot_) {
    staker = staker_;
    vault = vault_;
    token = GTokenERC20(token_);
    spot = GSpot(spot_);
  }

  function add(uint256 amount, bytes32 synth, Position position_) external {
    require(amount > 0);
    require(position_ == Position.SHORT || position_ == Position.LONG);
    require(token.transferFrom(msg.sender, address(vault), amount), "");

    uint256 price = spot.read(synth);
    require(price > 0);

    PositionData memory dataPosition = PositionData(
      msg.sender,
      position_,
      synth,
      price,
      0,
      amount
    );

    data[positionCount] = dataPosition;
    positionCount++;

    emit Add(msg.sender, dataPosition);
  }

  function drop(uint index, bytes32 synth) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender);
    uint256 price = spot.read(synth);
    require(price > 0);

    uint256 p = (dataPosition.amount * price - dataPosition.amount * dataPosition.initialPrice);
    uint256 currentPricePosition;
    if (dataPosition.position == Position.LONG) {
      currentPricePosition = dataPosition.amount + p;
    } else if (dataPosition.position == Position.SHORT) {
      // verificar se o p é maior dataPosition.amount
      currentPricePosition = dataPosition.amount - p;
    }

    dataPosition.position = Position.FINISHED;
    // calculo do tamanho do debtPool

    emit Drop(msg.sender, dataPosition, currentPricePosition);
  }
}
