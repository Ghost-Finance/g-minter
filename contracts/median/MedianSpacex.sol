//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Median.sol";

contract MedianSpacex is Median {
  bytes32 public constant feedType = "SPACEX";

  // change function to internal
  function recover(uint256 feedValue_, uint256 feedTimestamp_, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
    return ecrecover(
      keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(feedValue_, feedTimestamp_, feedType)))),
      v, r, s
    );
  }
}
