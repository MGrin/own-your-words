// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Custom.sol";

library OwnedAccount {
  struct data {
    uint256 id;
    address owner;

    string sn_name;
    string sn_id;
    string sn_url;
  }
}

contract OwnYourSocialNetwork is ERC721Custom {
  using OwnedAccount for OwnedAccount.data;

  function getVersion() public pure returns (string memory) {
    return "1.0.0";
  }

  mapping(string => uint256) private _owned_accounts_by_gen_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;

  function initialize() initializer public {
    __ERC721Custom_init("OwnYourSocialNetwork", "OWSN");
  }

  function mint(
    string memory sn_name,
    string memory sn_id,
    string memory access_token
  ) public virtual returns (uint256) {
    
    string memory gen_sn_id = string(
      abi.encodePacked(sn_name, sn_id)
    );

    require(
      _exists(_owned_accounts_by_gen_id[gen_sn_id]) == false,
      "OwnYourSocialNetwork: The account was already minted"
    );
    uint256 _token_id = _mint_without_owner(msg.sender);

    return _token_id;
  }

  function getOwnedAccountByToken(uint256 token_id) public view returns (OwnedAccount.data memory) {
    require(
      _exists(token_id),
      "OwnYourSocialNetwork: Get owned account query for nonexistent token"
    );

    return _owned_accounts_by_id[token_id];
  }

  function getOwnedAccountByGenSnId(string memory gen_sn_id) public view returns (OwnedAccount.data memory) {
    require(
      _exists(_owned_accounts_by_gen_id[gen_sn_id]),
      "OwnYourSocialNetwork: The account was not yet minted"
    );

    return _owned_accounts_by_id[_owned_accounts_by_gen_id[gen_sn_id]];
  }
}