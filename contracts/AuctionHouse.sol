//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GTokenERC20.sol';
import './base/Feed.sol';

contract AuctionHouse {
  struct Auction {
    address user;
    address tokenAddress;
    address collateralTokenAddress;
    address keeperAddress;
    uint256 collateralBalance;
    uint256 collateralValue;
    uint auctionTarget;
    address collateralFeedPrice;
    address synthFeedPrice;
    uint startTimestamp;
    uint endTimestamp;
  }

  uint256 constant WAD = 10**18;
  uint256 constant RAY = 10**27;
  uint256 constant RAD = 10**45;
  uint256 constant PRICE_REDUCTION_RATIO = (uint256(99) * RAY) / 100;
  uint256 constant ratio = 9;
  uint256 constant buf = 1 ether;
  uint256 constant step = 90;
  uint256 constant dust = 10 ether;
  uint256 constant PENALTY_FEE = 11;
  uint256 constant chost = (dust * PENALTY_FEE) / 10;

  Auction[] public auctions;

  event Start(address indexed cdp, address indexed keeper, uint amount, uint start, uint end);
  event Take(uint indexed id, address indexed keeper, address indexed to, uint amount, uint end);

  function start (
    address user_,
    address tokenAddress_,
    address collateralTokenAddress_,
    address keeperAddress_,
    uint256 collateralBalance_,
    uint256 collateralValue_,
    uint256 auctionTarget_,
    address collateralFeedPrice_,
    address synthFeedPrice_
  ) public {
    uint256 startTimestamp_ = block.timestamp;
    uint256 endTimestamp_ = startTimestamp_ + 1 weeks;

    auctions.push(
      Auction(
        user_,
        tokenAddress_,
        collateralTokenAddress_,
        keeperAddress_,
        collateralBalance_,
        collateralValue_,
        auctionTarget_,
        collateralFeedPrice_,
        synthFeedPrice_,
        startTimestamp_,
        endTimestamp_
      )
    );

    emit Start(tokenAddress_, keeperAddress_, collateralBalance_, startTimestamp_, endTimestamp_);
    require(GTokenERC20(collateralTokenAddress_).transferFrom(msg.sender, address(this), collateralBalance_), "token transfer fail");
  }

  function take(uint256 auctionId, uint256 amount, uint256 maxCollateralPrice, address receiver) public  {
    Auction storage auction = auctions[auctionId];
    uint slice;
    uint keeperAmount;
    require(amount > 0, 'Invalid amount');
    require(block.timestamp > auction.startTimestamp && block.timestamp < auction.endTimestamp, 'Auction period invalid');
    if (amount > auction.collateralBalance) {
      slice = auction.collateralBalance;
    } else {
      slice = amount;
    }

    uint initialPrice = Feed(auction.collateralFeedPrice).price();
    uint priceTimeHouse = price(initialPrice, block.timestamp - auction.startTimestamp);
    require(priceTimeHouse <= maxCollateralPrice, 'price time house is bigger than collateral price');

    uint owe = mul(slice, priceTimeHouse) / WAD;
    uint liquidationTarget = calculateAmountToFixCollateral(auction.auctionTarget, (auction.collateralBalance * priceTimeHouse) / WAD);
    require(liquidationTarget > 0);

    if (liquidationTarget > owe) {
      keeperAmount = owe;

      if (auction.auctionTarget - owe >= chost) {
        slice = radmul(owe, priceTimeHouse);
        auction.auctionTarget -= owe;
      } else {
        slice = radmul((auction.auctionTarget - chost), priceTimeHouse);
        auction.auctionTarget = chost;
      }
    } else {
      keeperAmount = liquidationTarget;
      slice = radmul(liquidationTarget, priceTimeHouse);
      auction.auctionTarget = 0;
    }

    // tranfer values for keeper
    GTokenERC20(auction.tokenAddress).approveKeeperTokensToAuction(amount * maxCollateralPrice);
    require(GTokenERC20(auction.tokenAddress).transferFrom(msg.sender, address(this), keeperAmount), 'bring token from keeper fail');
    require(GTokenERC20(auction.collateralTokenAddress).transfer(receiver, slice), "token transfer fail");

    emit Take(auctionId, msg.sender, receiver, slice, auction.endTimestamp);
  }

  function calculateAmountToFixCollateral(uint256 debtBalance, uint256 collateral) public pure returns (uint) {
    uint dividend = (ratio * debtBalance) - collateral;

    return dividend / (ratio - 1);
  }

  function radmul(uint256 dividend, uint256 divisor) public pure returns (uint256) {
    return div(div(dividend * RAD, divisor), RAY);
  }

  function getAuction(uint auctionId) public view returns (Auction memory) {
    return auctions[auctionId];
  }

  function price(uint256 initialPrice, uint256 duration) public pure returns (uint256) {
    return rmul(initialPrice, rpow(PRICE_REDUCTION_RATIO, duration / step, RAY));
  }

  function rmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
    z = mul(x, y);
    require(y == 0 || z / y == x);
    z = div(z, RAY);
  }

  function rpow(uint256 x, uint256 n, uint256 b) internal pure returns (uint256 z) {
    assembly {
      switch n case 0 { z := b }
      default {
        switch x case 0 { z := 0 }
        default {
          switch mod(n, 2) case 0 { z := b } default { z := x }
          let half := div(b, 2)  // for rounding.
          for { n := div(n, 2) } n { n := div(n,2) } {
            let xx := mul(x, x)
            if shr(128, x) { revert(0,0) }
            let xxRound := add(xx, half)
            if lt(xxRound, xx) { revert(0,0) }
            x := div(xxRound, b)
            if mod(n,2) {
              let zx := mul(z, x)
              if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) { revert(0,0) }
              let zxRound := add(zx, half)
              if lt(zxRound, zx) { revert(0,0) }
              z := div(zxRound, b)
            }
          }
        }
      }
    }
  }

  function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
    z = x * y;
  }

  function div(uint256 x, uint256 y) internal pure returns (uint256 z) {
    z = x / y;
  }
}
