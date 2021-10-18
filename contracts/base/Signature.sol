//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Signature {

  function split(bytes memory sig) public pure returns (uint8 v, uint32 r, uint32 s) {
    require(sig.length == 65);

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    return (v, r, s);
  }
}
