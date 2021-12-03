pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import './Ssm.sol';
import 'hardhat/console.sol';

contract GSpot is Ownable {

  mapping (uint8 => address) public oracles;

  function addSsm(bytes32 synth, address ssm_) public onlyOwner {
    require(ssm_ != address(0), "Invalid address");
    uint8 s;
    assembly {
      s := shl(152, synth)
    }
    console.log(s);
    require(oracles[s] == address(0), "Address already exists");
    oracles[s] = ssm_;
  }

  function peek(uint8 synthKey) external view returns (uint256, bool) {
    console.log(synthKey);
    (uint256 price, bool valid) = Ssm(oracles[synthKey]).peek();
    return (price, valid);
  }

  function read(uint8 synthKey) external view returns (uint256) {
    return Ssm(oracles[synthKey]).read();
  }
}
