// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract IMinter {
  function getPriceWEI() virtual public view returns (uint256);
}