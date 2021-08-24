//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GTokenERC20 is ERC20, Ownable, Pausable {
  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    _mint(msg.sender, 100000000000000000000);
  }

  function mintMinerReward(uint256 initialSupply_) public onlyOwner {
    _mint(block.coinbase, initialSupply_);
  }
}
