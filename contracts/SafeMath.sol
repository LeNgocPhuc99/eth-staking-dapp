// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SafeMath {
  function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require((z = x + y) >= x, "add overflow");
  }

  function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require((z = x - y) <= x, "sub overflow");
  }

  function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require(y == 0 || (z = x * y)/y == x, "mul overflow");
  }

  function div(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require(y != 0, "invalid div");
    z = x / y;
  }
}
