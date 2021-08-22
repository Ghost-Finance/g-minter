//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Token.sol';
import './AuctionHouse.sol';
import './base/Feed.sol';

contract Minter {
  address public owner;

  Token public collateralToken;
  Feed public  collateralFeed;
  AuctionHouse auctionHouse;
  Token[] public synths;

  mapping (address => mapping (Token => uint256)) public collateralBalance;
  mapping (Token => uint256) public cRatiosActive;
  mapping (Token => uint256) public cRatioPassive;
  mapping (Token => Feed) public feeds;
  mapping (address => mapping (Token => uint256)) public synthDebt;
  mapping (address => mapping (Token => uint256)) public plrDelay;

  // Events
  event CreateSynth(string name, string symbol, address feed);
  event Mint(address indexed account, uint256 amount, uint256 collateral);
  event Burn(address indexed account, address token, uint256 amount);
  event WithdrawnCollateral(address indexed account, address token, uint amount);
  event DepositedCollateral(address indexed account, address token, uint amount);

  // Events for liquidation
  event AccountFlaggedForLiquidation(address indexed account, uint256 deadline);
  event Liquidate(address indexed accountLiquidated, address indexed accountFrom, address token, uint256 collateralValue);

  modifier onlyOwner() {
    require(msg.sender == owner, "unauthorized");
    _;
  }

  constructor(address collateralToken_, address collateralFeed_, address auctionHouse_) {
    collateralToken = Token(collateralToken_);
    collateralFeed  = Feed(collateralFeed_);
    auctionHouse  = AuctionHouse(auctionHouse_);
    owner = msg.sender;
  }

  function getSynth(uint256 index) public view returns (Token) {
    return synths[index];
  }

  function createSynth(string calldata name, string calldata symbol, uint256 cRatioActive_, uint256 cRatioPassive_, Feed feed) external onlyOwner {
    require(cRatioPassive_ > cRatioActive_, "Invalid cRatioActive");

    uint id = synths.length;
    synths.push(new Token(name, symbol));
    cRatiosActive[synths[id]] = cRatioActive_;
    cRatioPassive[synths[id]] = cRatioPassive_;
    feeds[synths[id]] = feed;

    emit CreateSynth(name, symbol, address(feed));
  }

  function depositCollateral(Token token, uint256 amount) external {
    collateralToken.approve(msg.sender, amount);
    require(collateralToken.transferFrom(msg.sender, address(this), amount), "transfer failed");
    collateralBalance[msg.sender][token] += amount;

    emit DepositedCollateral(msg.sender, address(token), amount);
  }

  function withdrawnCollateral(uint256 amount, Token token) external {
    uint256 futureCollateralValue = (collateralBalance[msg.sender][token] - amount) * collateralFeed.price() / 1 ether;
    uint256 debtValue = synthDebt[msg.sender][token] * feeds[token].price() / 1 ether;
    require(futureCollateralValue >= debtValue * cRatiosActive[token] / 100, "below cRatio");

    collateralBalance[msg.sender][token] -= amount;
    collateralToken.transfer(msg.sender, amount);

    emit WithdrawnCollateral(msg.sender, address(token), amount);
  }

  function mint(Token token, uint256 amount) external {
    uint256 collateralValue = (collateralBalance[msg.sender][token] * collateralFeed.price()) / 1 ether;
    uint256 futureDebtValue = (synthDebt[msg.sender][token] + amount) * feeds[token].price() / 1 ether;
    require(collateralValue >= futureDebtValue * cRatiosActive[token] / 100, "below cRatio");

    token.mint(msg.sender, amount);
    token.approve(address(this), amount);
    synthDebt[msg.sender][token] += amount;

    emit Mint(msg.sender, amount, collateralValue);
  }

  function burn(Token token, uint256 amount) external {
    require(token.transferFrom(msg.sender, address(0), amount), "transfer failed");
    synthDebt[msg.sender][token] -= amount;

    emit Burn(msg.sender, address(token), amount);
  }

  function liquidate(address user, Token token) external {
    require(user != msg.sender, "invalid account");
    uint256 collateralValue = (collateralBalance[user][token] * collateralFeed.price()) / 1 ether;
    uint256 debtValue = synthDebt[user][token] * feeds[token].price() / 1 ether;
    require((collateralValue < debtValue * cRatiosActive[token] / 100) || (collateralValue < debtValue * cRatioPassive[token] / 100 && plrDelay[user][token] < block.timestamp), "above cRatio");

    collateralToken.approve(address(auctionHouse), collateralValue);
    token.approve(address(auctionHouse), debtValue);
    uint256 target = (debtValue / 10) * 11;
    uint256 priceReductionRatio = (1000000000 / uint256(10000000001)) * (10**27);
    auctionHouse.start(user, address(token), msg.sender, target, collateralValue, debtValue, priceReductionRatio, address(collateralFeed));
    // auctionHouse.start(address(token), msg.sender, target, collateralBalance[user][token], synthDebt[user][token], priceReductionRatio);
    collateralBalance[user][token] = 0;

    emit Liquidate(user, msg.sender, address(token), collateralValue);
  }

  function flagLiquidate(address user, Token token) external {
    uint256 collateralValue = (collateralBalance[user][token] * collateralFeed.price()) / 1 ether;
    uint256 debtValue = synthDebt[user][token] * feeds[token].price() / 1 ether;  
    require(collateralValue < debtValue * cRatioPassive[token] / 100, "above cRatioPassivo");
    plrDelay[user][token] = block.timestamp + 10 days;

    emit AccountFlaggedForLiquidation(user, plrDelay[user][token]);
  }

  function settleDebt(address user, Token token, uint amount) public {}

  function balanceOfSynth(address from, Token token) external view returns (uint) {
    return token.balanceOf(from);
  }

  function updateSynthCRatio(uint id, uint256 cRatio, uint256 cRatioPassivo_) external onlyOwner {
    require(cRatioPassivo_ > cRatio, "invalid cRatio");
    cRatiosActive[synths[id]] = cRatio;
    cRatioPassive[synths[id]] = cRatioPassivo_;
  }

  function updateSynthFeed(uint id, Feed feed) external {
    feeds[synths[id]] = feed;
  }
}
