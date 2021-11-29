pragma solidity ^0.8.0;

import './Ssm.sol';

contract GSpot is Ownable {

  mapping (bytes32 => Ssm) oracles;

  function addSsm(string synth, address ssm_) onlyOwner {
    bytes32 s;
    assembly {
      s := shr(152, synth)
    }

    oracles[s] = Ssm(ssm_);
  }

  function peek(bytes32 synth) external view returns (uint256, bool) {
    return oracles[synth].peek();
  }

  function read(bytes32 synth) external view returns (uint256) {
    return oracles[synth].read();
  }
}
