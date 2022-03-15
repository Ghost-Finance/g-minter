//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMedian {
  function peek() external view returns (uint256, bool);
  function read() external view returns (uint256);
}
