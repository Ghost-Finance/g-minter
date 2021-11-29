//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GTokenERC20.sol';
import './Minter.sol';

contract DebtPool {

  GTokenERC20 public token;
  Minter public minter;

  constructor(address token_, address minter_) {
    token = GTokenERC20(token_);
    minter = Minter(minter);
  }

  function setTotalSystemDebt(uint256 amount) public {
    minter.setAmountToken(token, amount);
  }

  function getSynthDebt() public returns (uint256) {
    return minter.synthDebt(address(this), token);
  }

  // function get(type name) {
  // }

  // PositionVault
    // - Chamado quando precisa de debto
    // - Chamado quando precisa queimar
}