//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GTokenERC20.sol';
import './AuctionHouse.sol';
import './base/Feed.sol';
import './DebtPool.sol';
import './base/CoreMath.sol';

contract Minter {
  using SafeMath for uint256;

  address public owner;

  GTokenERC20 public collateralToken;
  Feed public  collateralFeed;
  AuctionHouse auctionHouse;
  DebtPool debtPool;
  GTokenERC20[] public synths;

  uint256 public constant PENALTY_FEE = 11;
  uint256 public constant FLAG_TIP = 3 ether;
  uint public ratio = 9 ether;

  mapping (address => mapping (GTokenERC20 => uint256)) public collateralBalance;
  mapping (GTokenERC20 => uint256) public cRatioActive;
  mapping (GTokenERC20 => uint256) public cRatioPassive;
  mapping (GTokenERC20 => Feed) public feeds;
  mapping (address => mapping (GTokenERC20 => uint256)) public synthDebt;
  mapping (address => mapping (GTokenERC20 => uint256)) public auctionDebt;
  mapping (address => mapping (GTokenERC20 => uint256)) public plrDelay;

  // Events
  event CreateSynth(address token, string name, string symbol, address feed);
  event Mint(address indexed account, uint256 totalAmount);
  event Burn(address indexed account, address token, uint256 amount);
  event WithdrawnCollateral(address indexed account, address token, uint amount);
  event DepositedCollateral(address indexed account, address token, uint amount);

  // Events for liquidation
  event AccountFlaggedForLiquidation(address indexed account, address indexed keeper, uint256 deadline);
  event Liquidate(address indexed accountLiquidated, address indexed accountFrom, address token);

  event AuctionFinish(uint256 indexed id, address user, uint256 finished_at);

  modifier onlyOwner() {
    require(msg.sender == owner, 'unauthorized');
    _;
  }

  modifier isCollateral(GTokenERC20 token) {
    require(address(token) != address(collateralToken), 'invalid token');
    _;
  }

  modifier isValidKeeper(address user) {
    require(user != address(msg.sender), 'Sender cannot be the liquidated');
    _;
  }

  modifier onlyDebtPool() {
    require(address(debtPool) == address(msg.sender), 'Only permitted contract!');
    _;
  }

  constructor(address collateralToken_, address collateralFeed_, address auctionHouse_) {
    collateralToken = GTokenERC20(collateralToken_);
    collateralFeed  = Feed(collateralFeed_);
    auctionHouse  = AuctionHouse(auctionHouse_);
    owner = msg.sender;
  }

  function addDebtPool(address debtPool_) public onlyOwner {
    debtPool = DebtPool(debtPool_);
  }

  function getSynth(uint256 index) public view returns (GTokenERC20) {
    return synths[index];
  }

  function createSynth(string calldata name, string calldata symbol, uint initialSupply, uint256 cRatioActive_, uint256 cRatioPassive_, Feed feed) external onlyOwner {
    require(cRatioPassive_ > cRatioActive_, 'Invalid cRatioActive');

    uint id = synths.length;
    GTokenERC20 token = new GTokenERC20(name, symbol, initialSupply);
    synths.push(token);
    cRatioActive[synths[id]] = cRatioActive_;
    cRatioPassive[synths[id]] = cRatioPassive_;
    feeds[synths[id]] = feed;

    emit CreateSynth(address(token), name, symbol, address(feed));
  }

  function withdrawnCollateral(GTokenERC20 token, uint256 amount) external {
    require(collateralBalance[msg.sender][token] >= amount, 'Insufficient quantity');
    uint256 futureCollateralValue = (collateralBalance[msg.sender][token] - amount) * collateralFeed.price() / 1 ether;
    uint256 debtValue = globalAccountDebt(token, address(msg.sender)) * feeds[token].price() / 1 ether;
    require(calculateCRatio(futureCollateralValue, debtValue) >= cRatioActive[token], "below cRatio");

    collateralBalance[msg.sender][token] -= amount;
    require(collateralToken.transfer(msg.sender, amount), "transfer failed");

    emit WithdrawnCollateral(msg.sender, address(token), amount);
  }

  function mint(GTokenERC20 token, uint256 amountToDeposit, uint256 amountToMint) external isCollateral(token) {
    require(collateralToken.approve(msg.sender, amountToDeposit), "token approval failed");
    require(collateralToken.transferFrom(msg.sender, address(this), amountToDeposit), 'transfer failed');
    collateralBalance[msg.sender][token] += amountToDeposit;

    emit DepositedCollateral(msg.sender, address(token), amountToDeposit);

    require(collateralBalance[msg.sender][token] > 0, 'Without collateral deposit');
    uint256 futureCollateralValue = collateralBalance[msg.sender][token] * collateralFeed.price() / 1 ether;
    uint256 futureDebtValue = (globalAccountDebt(token, address(msg.sender)) + amountToMint) * feeds[token].price() / 1 ether;
    require(calculateCRatio(futureCollateralValue, futureDebtValue) >= ratio, 'Above max amount');

    token.mint(msg.sender, amountToMint);
    synthDebt[msg.sender][token] += amountToMint;

    emit Mint(msg.sender, synthDebt[msg.sender][token]);
  }

  function burn(GTokenERC20 token, uint256 amount) external {
    require(token.transferFrom(msg.sender, address(this), amount), 'transfer failed');
    token.burn(amount);
    synthDebt[msg.sender][token] -= amount;

    emit Burn(msg.sender, address(token), amount);
  }

  function debtPoolMint(GTokenERC20 token, uint256 amount) public onlyDebtPool {
    synthDebt[msg.sender][token] += amount;
    token.mint(msg.sender, amount);
  }

  function debtPoolBurn(GTokenERC20 token, uint256 amount) public onlyDebtPool {
    if (synthDebt[msg.sender][token] > 0) {
      synthDebt[msg.sender][token] -= amount;
    }

    token.burn(amount);
  }

  function globalAccountDebt(GTokenERC20 token, address account) internal view returns (uint256) {
    uint poolDebtPerToken = synthDebt[address(debtPool)][token] / (token.totalSupply() - synthDebt[address(debtPool)][token]);

    return synthDebt[account][token] + (synthDebt[account][token] * poolDebtPerToken);
  }

  function liquidate(address user, GTokenERC20 token) external isValidKeeper(user) {
    require(plrDelay[user][token] > 0);
    Feed syntFeed = feeds[token];
    uint256 priceFeed = collateralFeed.price();
    uint256 collateralValue = (collateralBalance[user][token] * priceFeed) / 1 ether;
    uint256 debtValue = globalAccountDebt(token, address(user)) * syntFeed.price() / 1 ether;
    require((collateralValue < debtValue * cRatioActive[token] / 100) || (collateralValue < debtValue * cRatioPassive[token] / 100 && plrDelay[user][token] < block.timestamp), 'above cRatio');

    require(collateralToken.approve(address(auctionHouse), collateralBalance[user][token]), "token approval failed");
    {
      uint debtAmountTransferable = debtValue / 10;
      _mintPenalty(token, user, msg.sender, debtAmountTransferable);
      auctionDebt[user][token] += synthDebt[user][token];

      uint256 _collateralBalance = collateralBalance[user][token];
      uint256 _auctionDebt = (auctionDebt[user][token] * syntFeed.price()) / 1 ether;
      auctionHouse.start(user, address(token), address(collateralToken), msg.sender, _collateralBalance, collateralValue, _auctionDebt, priceFeed);

      updateCollateralAndSynthDebt(user, token);
      _transferLiquidate(token, msg.sender, debtAmountTransferable);

      emit Liquidate(user, msg.sender, address(token));
    }
  }

  function updateCollateralAndSynthDebt(address user, GTokenERC20 token) private {
    collateralBalance[user][token] = 0;
    synthDebt[user][token] = 0;
  }

  function auctionFinish(uint256 auctionId, address user, GTokenERC20 _collateralToken, GTokenERC20 synthToken, uint256 collateralAmount, uint256 synthAmount) public {
    require(address(auctionHouse) == msg.sender, 'Only auction house!');
    require(_collateralToken.transferFrom(msg.sender, address(this), collateralAmount), 'transfer failed');
    require(synthToken.transferFrom(msg.sender, address(this), synthAmount), 'transfer failed');
    synthToken.burn(synthAmount);

    collateralBalance[user][synthToken] = collateralAmount;
    auctionDebt[user][synthToken] -= synthAmount;
    plrDelay[user][synthToken] = 0;

    emit AuctionFinish(auctionId, user, block.timestamp);
  }

  function flagLiquidate(address user, GTokenERC20 token) external isValidKeeper(user) {
    require(plrDelay[user][token] < block.timestamp);
    require(collateralBalance[user][token] > 0 && synthDebt[user][token] > 0, 'User cannot be flagged for liquidate');

    require(getCRatio(token, user) < cRatioPassive[token], "Above cRatioPassivo");
    plrDelay[user][token] = block.timestamp + 10 days;

    _mintPenalty(token, user, msg.sender, FLAG_TIP);

    emit AccountFlaggedForLiquidation(user, msg.sender, plrDelay[user][token]);
  }

  function balanceOfSynth(address from, GTokenERC20 token) external view returns (uint) {
    return token.balanceOf(from);
  }

  function updateSynthCRatio(GTokenERC20 token, uint256 cRatio_, uint256 cRatioPassivo_) external onlyOwner {
    require(cRatioPassivo_ > cRatio_, 'invalid cRatio');
    cRatioActive[token] = cRatio_;
    cRatioPassive[token] = cRatioPassivo_;
  }

  function maximumByCollateral(GTokenERC20 token, uint256 amount) external view returns (uint256) {
    require(amount != 0, 'Incorrect values');
    uint256 collateralValue = (collateralBalance[msg.sender][token] + amount) * collateralFeed.price() / 1 ether;

    return (collateralValue / ratio) * 1 ether;
  }

  function maximumByDebt(GTokenERC20 token, uint256 amount) external view returns (uint256) {
    require(amount != 0, 'Incorrect values');
    uint256 debtValue = (synthDebt[msg.sender][token] + amount) * feeds[token].price() / 1 ether;

    return (debtValue * ratio) / 1 ether;
  }

  function getCRatio(GTokenERC20 token, address user) public view returns (uint256) {
    if (collateralBalance[user][token] == 0 || synthDebt[user][token] == 0) {
      return 0;
    }

    uint256 collateralValue = collateralBalance[user][token] * collateralFeed.price() / 1 ether;
    uint256 debtValue = synthDebt[user][token] * feeds[token].price() / 1 ether;

    return calculateCRatio(collateralValue, debtValue);
  }

  function simulateCRatio(GTokenERC20 token, address user, uint256 amountGHO, uint256 amountGDAI) external view returns (uint256) {
    require(amountGHO != 0 || amountGDAI != 0, 'Incorrect values');
    uint256 collateralValue = (collateralBalance[user][token] + amountGHO) * collateralFeed.price() / 1 ether;
    uint256 debtValue = (synthDebt[user][token] + amountGDAI) * feeds[token].price() / 1 ether;

    return calculateCRatio(collateralValue, debtValue);
  }

  function calculateCRatio(uint collateralValue, uint debtValue) internal pure returns (uint) {
      return collateralValue.mul(1 ether).div(debtValue);
  }

  function _mintPenalty(GTokenERC20 token, address user, address keeper, uint256 amount) internal {
    synthDebt[address(user)][token] += amount;

    token.mint(address(keeper), amount);
  }

  function _transferLiquidate(GTokenERC20 token, address keeper, uint256 amount) internal {
    uint keeperReceiveAmount = (amount / 100) * 60;

    require(token.transfer(address(keeper), keeperReceiveAmount), 'failed transfer incentive');
  }
}
