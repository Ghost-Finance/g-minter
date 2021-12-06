pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import './Ssm.sol';

contract GSpot is Ownable {

  mapping (bytes32 => address) public oracles;

  function addSsm(bytes32 synth, address ssm_) public onlyOwner {
    require(ssm_ != address(0), "Invalid address");
    require(oracles[synth] == address(0), "Address already exists");
    oracles[synth] = ssm_;
  }

  function peek(bytes32 synthKey) external view returns (uint256, bool) {
    (uint256 price, bool valid) = Ssm(oracles[synthKey]).peek();
    return (price, valid);
  }

  function read(bytes32 synthKey) external view returns (uint256) {
    return Ssm(oracles[synthKey]).read();
  }
}
