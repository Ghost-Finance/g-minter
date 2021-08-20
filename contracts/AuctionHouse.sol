//SPDX-License-Identifier: lalala
pragma solidity ^0.8.0;

import './Token.sol';

contract AuctionHouse {
  struct Auction {
    address user;
    address tokenAddress; //cdpAccountAddress;
    address keeperAddress;
    uint256 auctionTarget;
    uint256 collateralAmount;
    uint256 initialPrice;
    uint256 priceReductionRatio;
    address collateralFeedPrice;
    uint256 startTimestamp;
    uint256 endTimestamp;
  }

  uint constant WAD = 10**18;
  uint constant RAY = 10**27;
  uint constant RAD = 10**45;

  Auction[] public auctions;

  event Start(address indexed cdp, address indexed keeper, uint256 auctionTarget, uint start, uint end);
  event Take(uint256 indexed id, address indexed keeper, address indexed to, uint amount, uint totalAmount, uint end);

  function start (
    address user_,
    address tokenAddress_,
    address keeperAddress_,
    uint auctionTarget_,
    uint256 collateralAmount_,
    uint initialPrice_, // pode ser de oracle
    uint256 priceReductionRatio_, // 0.999999999999999999999999999 1% aa. step=90s
    address collateralFeedPrice_
  ) public {
    uint256 initialDate = block.timestamp;
    uint256 endDate = initialDate + 1 weeks;

    auctions.push(
      Auction(
        user_,
        tokenAddress_,
        keeperAddress_,
        auctionTarget_,
        collateralAmount_,
        initialPrice_,
        priceReductionRatio_,
        collateralFeedPrice_,
        initialDate,
        endDate
      )
    );

    // emitir evento
    emit Start(tokenAddress_, keeperAddress_, auctionTarget_, initialDate, endDate);

    // tras o tokenToSell
    require(Token(tokenAddress_).transferFrom(msg.sender, address(this), initialPrice_), "token transfer fail");
    // require(Token(tokenAddress_).transferFrom(tx.origin, address(this), initialPrice_), "token transfer fail");
  }

  // auctionId,
  // amt amount para a comprar
  // receiver address
  // address timeHouse que deve retornar o preço atual do GDai
  function take(uint auctionId, uint amount, address receiver) public {
    Auction storage auction = auctions[auctionId];
    uint slice;
    require(auction.auctionTarget > 0);
    require(block.timestamp > auction.startTimestamp && block.timestamp < auction.endTimestamp);
    uint totalAmountAuction = price(auction.initialPrice, block.timestamp - auction.auctionTarget, auction.priceReductionRatio) * auction.auctionTarget;
    if (amount > totalAmountAuction) {
      slice = totalAmountAuction;
    } else {
      slice = amount;
    }

    require(Token(auction.tokenAddress).transferFrom(msg.sender, receiver, slice), "token transfer fail");

    // etapas:
    //  - slice deve calcular
    auction.collateralAmount -= slice;
    if (auction.collateralAmount == 0) {
      auction.endTimestamp = block.timestamp;
    }

    // emitir evento
    emit Take(auctionId, msg.sender, receiver, slice, auction.collateralAmount, auction.endTimestamp);
  }

  // top: initial price
  // dur: seconds since the auction has started
  // cut: cut encodes the percentage to decrease per second.
  //   For efficiency, the values is set as (1 - (% value / 100)) * RAY
  //   So, for a 1% decrease per second, cut would be (1 - 0.01) * RAY
  //
  // returns: top * (cut ^ dur)
  //
  function price(uint256 initialPrice, uint256 duration, uint priceReductionRatio) public pure returns (uint256) {
    return rpow(priceReductionRatio, duration, RAY) * initialPrice / RAY;
  }

  // optimized version from dss PR #78
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

  function getAuction(uint auctionId) public view returns (Auction memory) {
    return auctions[auctionId];
  }
}
