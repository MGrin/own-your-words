// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract IOwnYourSocialNetwork {
  function mint(
    string memory sn_name,
    string memory sn_id,
    string memory sn_url,
    address to
  ) virtual external returns (uint256);
}