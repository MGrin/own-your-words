// SPDX-License-Identifier: MIT ①

pragma solidity ^0.8.0;

import "../contracts/ERC721PresetMinterPauserAutoId.sol";

contract SocialNetworkOwnership is ERC721PresetMinterPauserAutoId {
  constructor()
    ERC721PresetMinterPauserAutoId("SocialNetworkOwnership", "SNO")
  {}

  event MintSocialNetworkAccount(string social_network_id);

  function mint(address to, string memory sn_id) public virtual {
    _mint_with_owner(to);
    emit MintSocialNetworkAccount(sn_id);
  }
}
