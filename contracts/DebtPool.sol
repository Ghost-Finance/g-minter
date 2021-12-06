//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import './GTokenERC20.sol';
import './UpdateHouse.sol';
import './Minter.sol';

contract DebtPool is Ownable {

  GTokenERC20 public token;
  Minter public minter;
  UpdateHouse public updateHouse;

  modifier onlyHouse() {
    require(msg.sender == address(updateHouse), 'Is not update house');
    _;
  }

  constructor(address token_, address minter_) {
    token = GTokenERC20(token_);
    minter = Minter(minter);
  }

  function addUpdatedHouse(address updated_) public onlyOwner {
    updateHouse = UpdateHouse(updated_);
  }

  function update(uint256 amount, uint256 currentAmount) public onlyHouse returns (bool) {
    if (currentAmount > amount) {
      // mint
      minter.debtPoolMint(token, currentAmount - amount);
    } else {
      // burn
      minter.debtPoolBurn(token, amount - currentAmount);
    }

    token.approve(address(updateHouse), currentAmount);
    return true;
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