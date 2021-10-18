//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Signature {

  function extractRSV(bytes memory sig) public pure returns (uint32, uint32, uint8) {
    uint32 r;
    uint32 s;
    uint8 v;

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := and(mload(add(sig, 65)), 255)
    }

    if (v < 27) v += 27;

    return (r, s, v);
  }
}
