//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GDai.sol';
import './base/Feed.sol';

contract Minter {
  address public owner;

  // Collateral
  GDai public collateralToken;
  Feed public  collateralFeed;
  mapping (address => mapping (GDai => uint256)) public collateralBalance;

  // Synths
  GDai[] public synths;
  mapping (GDai => uint256) public cRatios;
  mapping (GDai => Feed) public feeds;
  mapping (address => mapping (GDai => uint256)) public synthDebt;

  // AuctionHouse
  // AuctionHouse auctionHouse;

  // Events

  constructor(address collateralToken_, address collateralFeed_, address auctionHouse_) {
    collateralToken = GDai(collateralToken_);
    collateralFeed  = Feed(collateralFeed_);
    // auctionHouse  = AuctionHouse(auctionHouse_);
    owner = msg.sender;
  }
  function getSynth(uint256 index) public view returns (GDai) {
    return synths[index];
  }
  function createSynth(string calldata name, string calldata symbol, uint256 cRatio, Feed feed) external {
    require(msg.sender == owner, "unauthorized");
    synths.push(new GDai());
    cRatios[synths[synths.length - 1]] = cRatio;
    feeds[synths[synths.length - 1]] = feed;
  }

  function depositCollateral(uint256 amount, GDai token) external {
    require(collateralToken.transferFrom(msg.sender, address(this), amount), "transfer failed");
    collateralBalance[msg.sender][token] += amount;
  }

  function withdrawCollateral(uint256 amount, GDai token) external {
    uint256 futureCollateralValue = (collateralBalance[msg.sender][token] - amount) * collateralFeed.price() / 1 ether;
    uint256 debtValue = synthDebt[msg.sender][token] * feeds[token].price() / 1 ether;          
    require(futureCollateralValue >= debtValue * cRatios[token] / 100, "below cRatio");

    collateralBalance[msg.sender][token] -= amount;
    collateralToken.transfer(msg.sender, amount);
  }

  function mint(GDai token, uint256 amount) external {
    uint256 collateralValue = (collateralBalance[msg.sender][token] * collateralFeed.price()) / 1 ether;
    uint256 futureDebtValue = (synthDebt[msg.sender][token] + amount) * feeds[token].price() / 1 ether;
    require(collateralValue >= futureDebtValue * cRatios[token] / 100, "below cRatio");
    token.mint(msg.sender, amount);
    synthDebt[msg.sender][token] += amount;
  }

  function burn(GDai token, uint256 amount) external {
    require(token.transferFrom(msg.sender, address(0), amount), "transfer failed");
    synthDebt[msg.sender][token] -= amount;
  }

  function liquidate(address user, GDai token) external {
    uint256 collateralValue = (collateralBalance[user][token] * collateralFeed.price()) / 1 ether;
    uint256 debtValue = synthDebt[user][token] * feeds[token].price() / 1 ether;  
    require(collateralValue < debtValue * cRatios[token] / 100, "above cRatio");

    // collateralToken.approve(address(auctionHouse), collateralBalance[user][token]);
    // auctionHouse.startAuction(collateralBalance[user][token], synthDebt[user][token], address(token), user);
    collateralBalance[user][token] = 0;
  }

  function settleDebt(address user, GDai token, uint amount) public {}
}
