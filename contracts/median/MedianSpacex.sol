//SPDX-License-Identifier: MIT
// Fork by Maker Median.sol https://github.com/makerdao/median/blob/master/src/median.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MedianSpacex is Ownable {
  uint128        val;
  uint32  public age;
  bytes32 public wat = "GSPACEX";
  uint256 public bar = 3; // numero de respostas para cada feed

  struct FeedData {
    uint256 value;
    uint256 age;
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  // Authorized oracles, set by an auth
  mapping (address => uint256) public oracle;

  // Whitelisted contracts, set by an auth
  mapping (address => uint256) public bud;

  // Mapping for at most 256 oracles
  mapping (uint8 => address) public slot;

  modifier toll { require(bud[msg.sender] == 1, "Contract not permitted to read"); _;}

  event LogMedianPrice(uint256 val, uint256 age);

  constructor() {}

  function read() external view toll returns (uint256) {
    (uint256 price, bool valid) = peek();
    require(valid, "Invalid price to read");

    return price;
  }

  function peek() public view toll returns (uint256, bool) {
    return (val, val > 0);
  }

  function recover(uint256 val_, uint256 age_, uint8 v, bytes32 r, bytes32 s) virtual public view returns (address) {
    return ecrecover(
      keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(val_, age_, wat)))),
      v, r, s
    );
  }

  function poke(
    FeedData[] memory data
  ) external {
    require(data.length == bar, "Invalid number of answers of Oracles");

    uint256 bloom = 0;
    uint256 last = 0;
    uint256 zzz = age;

    for (uint i = 0; i < data.length; i++) {
      uint8 sl;
      // Validate the values were signed by an authorized oracle
      address signer = recover(data[i].value, data[i].age, data[i].v, data[i].r, data[i].s);
      // Check that signer is an oracle
      require(oracle[signer] == 1, "Not authorized oracle signer");
      // Price feed age greater than last medianizer age
      require(data[i].age > zzz, "Signer oracle message expired");
      // Check for ordered values
      require(data[i].value >= last, "Message is not in the order");
      last = data[i].value;
      // Bloom filter for signer uniqueness
      assembly {
        sl := shr(152, signer)
      }
      require((bloom >> sl) % 2 == 0, "Signer oracle already sended");
      bloom += uint256(2) ** sl;
    }

    val = uint128(data[data.length >> 1].value);
    age = uint32(block.timestamp);
    emit LogMedianPrice(val, age);
  }

  function lift(address account) external onlyOwner {
    require(account != address(0), "Median/no-oracle-0");
    uint8 s;
    assembly {
      s := shr(152, account)
    }
    require(slot[s] == address(0), "Median/signer-already-exists");
    oracle[account] = 1;
    slot[s] = account;
  }

  function drop(address account) external onlyOwner {
    uint8 s;
    oracle[account] = 0;
    assembly {
      s := shr(152, account)
    }
    slot[s] = address(0);
  }

  function setBar(uint256 bar_) external onlyOwner {
    require(bar_ > 0, "Median/quorum-is-zero");
    require(bar_ % 2 != 0, "Median/quorum-not-odd-number");
    bar = bar_;
  }

  function kiss(address a) external onlyOwner {
    require(a != address(0), "Median/no-contract-0");
    bud[a] = 1;
  }

  function diss(address a) external onlyOwner {
    bud[a] = 0;
  }

  function kiss(address[] calldata a) external onlyOwner {
    for(uint i = 0; i < a.length; i++) {
      require(a[i] != address(0), "Median/no-contract-0");
      bud[a[i]] = 1;
    }
  }

  function diss(address[] calldata a) external onlyOwner {
    for(uint i = 0; i < a.length; i++) {
      bud[a[i]] = 0;
    }
  }
}
