//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GDai is ERC20, Ownable, Pausable {
    
    constructor() ERC20("gDai", "GDAI") {
      _mint(msg.sender, 0);
    }
}