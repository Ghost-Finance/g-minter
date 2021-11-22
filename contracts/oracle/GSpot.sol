pragma solidity ^0.8.0;

import './Ssm.sol';

contract GSpot {
  Ssm public ssmContract;

  constructor(address ssm_) {
    ssmContract = Ssm(ssm_);
  }

  function peek() external view returns (uint256, bool) {
    return ssmContract.peek();
  }

  function read() external view returns (uint256) {
    return ssmContract.read();
  }
}
