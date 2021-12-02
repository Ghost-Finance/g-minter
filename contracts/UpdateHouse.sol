//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './oracle/GSpot.sol';
import './base/CoreMath.sol';
import './GTokenERC20.sol';

contract UpdateHouse {
  using CoreMath for uint;

  GTokenERC20 token;
  GSpot spot;
  address staker;
  address vault;

  enum Position{ UNSET, SHORT, LONG, FINISHED }

  struct PositionData {
    address account;
    Position position;
    uint8  synth;
    uint256 initialPrice;
    uint256 lastPrice;
    uint256 tokenAmount;
  }

  uint positionCount;

  mapping (uint => PositionData) data;

  event Add(address account, PositionData position);
  event Drop(address account, PositionData position, uint256 price);

  constructor(GTokenERC20 token_, address staker_, address vault_, GSpot spot_) {
    staker = staker_;
    vault = vault_;
    token = GTokenERC20(token_);
    spot = GSpot(spot_);
  }

  function add(uint256 amount, uint8 synth, Position position_) external {
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

  function finishPosition(uint index, uint8 synth) external {
    PositionData storage dataPosition = data[index];
    require(dataPosition.account == msg.sender);
    uint256 price = spot.read(synth);
    require(price > 0);

    uint256 p = (dataPosition.tokenAmount * price - dataPosition.tokenAmount * dataPosition.initialPrice);
    uint256 currentPricePosition;
    if (dataPosition.position == Position.LONG) {
      currentPricePosition = dataPosition.tokenAmount.add(p);
    } else if (dataPosition.position == Position.SHORT) {
      // verificar se o p é maior dataPosition.amount
      currentPricePosition = dataPosition.tokenAmount.orderToSub(p);
    }

    dataPosition.position = Position.FINISHED;
    // calculo do tamanho do debtPool

    emit Drop(msg.sender, dataPosition, currentPricePosition);
  }
}
