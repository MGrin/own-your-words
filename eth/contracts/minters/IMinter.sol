// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract IMinter {
  function getPriceWEI() virtual public view returns (uint256);
  function failMint(uint256 reqId, string memory err) virtual external;
  function isAvailable(string memory sn_id) virtual public view returns (bool) ;
  function tokenExists(uint256 token_id) virtual public view returns (bool) ;
  function retrieveFunds() virtual public;
  function getSnName() virtual public pure returns(bytes32) ;
}