//SPDX-License-Identifier: MIT
// Fork by Maker Median.sol https://github.com/makerdao/median/blob/master/src/median.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Median is Ownable {

  struct FeedData {
    uint256 value;
    uint timestamp;
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  uint128        feedValue;
  uint32  public feedCreatedAt;
  bytes32 public feedType = "DAI";
  uint256 public bar = 3; // numero de respostas para cada feed

  // Authorized oracles, set by an auth
  mapping (address => uint256) public oracle;

  // Whitelisted contracts, set by an auth
  mapping (address => uint256) public bud;

  // Mapping for at most 256 oracles
  mapping (uint8 => address) public slot;

  modifier toll { require(bud[msg.sender] == 1, "Median/contract-not-whitelisted"); _;}

  event LogMedianPrice(uint256 val, uint256 age);

  constructor() {}

  function read() external view toll returns (uint256) {
    (uint256 price, bool valid) = peek();
    require(valid, "Median/invalid-price-feed");

    return price;
  }

  function peek() public view toll returns (uint256, bool) {
    // Adiciona a janela de tempo
    return (feedValue, feedValue > 0);
  }

  function recover(uint256 feedValue_, uint256 feedTimestamp_, uint8 v, bytes32 r, bytes32 s) virtual public view returns (address) {
    return ecrecover(
      keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(feedValue_, feedTimestamp_, feedType)))),
      v, r, s
    );
  }

  function poke(FeedData[] memory data) external {
    console.logString("entrouuuu na funcao");
    require(data.length == bar, "Invalid number of answers of Oracles");
    // console.log(data);

    uint256 bloom = 0;
    uint256 last = 0;
    uint256 zzz = feedCreatedAt;

    for (uint i = 0; i < data.length; i++) {
      uint8 sl;
      // Validate the values were signed by an authorized oracle
      // console.logString("Median for:");
      // console.logUint(data[i].value);
      // console.logUint(data[i].timestamp);
      // console.logUint(data[i].v);
      // console.logBytes32(data[i].r);
      // console.logBytes32(data[i].s);
      address signer = recover(data[i].value, data[i].timestamp, data[i].v, data[i].r, data[i].s);
      // Check that signer is an oracle
      console.logAddress(signer);
      require(oracle[signer] == 1, "Median/invalid-oracle");
      // Price feed age greater than last medianizer age
      require(data[i].timestamp > zzz, "Median/stale-message");
      // Check for ordered values
      require(data[i].value >= last, "Median/messages-not-in-order");
      last = data[i].value;
      // Bloom filter for signer uniqueness
      assembly {
        sl := shr(152, signer)
      }
      require((bloom >> sl) % 2 == 0, "Median/oracle-already-signed");
      bloom += uint256(2) ** sl;
    }

    feedValue = uint128(data[data.length >> 1].value);
    feedCreatedAt = uint32(block.timestamp);
    console.log(feedValue);
    emit LogMedianPrice(feedValue, feedCreatedAt);
  }

  function addOracle(address newOracle) external onlyOwner {
    oracle[newOracle] = 1;
  }
}
