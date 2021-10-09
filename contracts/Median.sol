//SPDX-License-Identifier: MIT
// Fork by Maker Median.sol https://github.com/makerdao/median/blob/master/src/median.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Median is Ownable {

  // --- Auth ---
  // mapping (address => uint) public owner;
  // function rely(address usr) external auth { owner[usr] = 1; }
  // function deny(address usr) external auth { owner[usr] = 0; }

  // modifier auth {
  //   require(owner[msg.sender] == 1, "Median/not-authorized");
  //   _;
  // }
  struct FeedData {
    uint256 value;
    uint timestamp;
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  uint128        feedValue;
  uint32  public feedCreatedAt;
  bytes32 public constant feedType = "spacex";
  uint256 public bar = 3; // numero de respostas para cada feed

  // Authorized oracles, set by an auth
  mapping (address => uint256) public oracle;

  // Whitelisted contracts, set by an auth
  mapping (address => uint256) public bud;

  // Mapping for at most 256 oracles
  mapping (uint8 => address) public slot;

  modifier toll { require(bud[msg.sender] == 1, "Median/contract-not-whitelisted"); _;}

  event LogMedianPrice(uint256 val, uint256 age);

  function read() external view toll returns (uint256) {
    (uint256 price, bool valid) = peek();
    require(valid, "Median/invalid-price-feed");

    return price;
  }

  function peek() public view toll returns (uint256, bool) {
    // Adiciona a janela de tempo
    return (feedValue, feedValue > 0);
  }

  function recover(uint256 feedValue_, uint256 feedTimestamp_, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
    return ecrecover(
      keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(feedValue_, feedTimestamp_, feedType)))),
      v, r, s
    );
  }

  function poke(FeedData[] memory data) external {
    require(data.length == bar, "Median/bar-too-low");

    uint256 bloom = 0;
    uint256 last = 0;
    uint256 zzz = feedCreatedAt;

    for (uint i = 0; i < data.length; i++) {
      // Validate the values were signed by an authorized oracle
      address signer = recover(data[i].value, data[i].timestamp, data[i].v, data[i].r, data[i].s);
      // Check that signer is an oracle
      require(oracle[signer] == 1, "Median/invalid-oracle");
      // Price feed age greater than last medianizer age
      require(data[i].timestamp > zzz, "Median/stale-message");
      // Check for ordered values
      require(data[i].value >= last, "Median/messages-not-in-order");
      last = data[i].value;
      // Bloom filter for signer uniqueness
      // TODO
      uint8 sl = uint8(uint256(bytes32(bytes20(signer))) >> 152);
      require((bloom >> sl) % 2 == 0, "Median/oracle-already-signed");
      bloom += uint256(2) ** sl;
    }

    feedValue = uint128(data[data.length >> 1].value);
    feedCreatedAt = uint32(block.timestamp);

    emit LogMedianPrice(feedValue, feedCreatedAt);
  }

  function addOracle(address newOracle) external onlyOwner {
    oracle[newOracle] = 1;
  }
}
