// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Custom.sol";
import "./IOwnYourSocialNetwork.sol";
import "./minters/TwitterMinter.sol";

library OwnedAccount {
  struct data {
    uint256 id;
    address owner;

    string sn_name;
    string sn_id;
    string sn_url;
  }
}

contract OwnYourSocialNetwork is ERC721Custom, IOwnYourSocialNetwork {
  using OwnedAccount for OwnedAccount.data;

  function getVersion() external pure returns (string memory) {
    return "1.0.0";
  }

  mapping(string => uint256) private _owned_accounts_by_gen_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;
  TwitterMinter public twitterMinter;
  /////////////////////////////////////////////////////////////////////////////////////

  function __OwnYourSocialNetwork__init(string memory name, string memory symbol, address twitterMinterAddress) initializer public  {
    __ERC721Custom_init(name, symbol);
    twitterMinter = TwitterMinter(twitterMinterAddress);
  }

  function mint(
    string memory sn_name,
    string memory sn_id,
    string memory sn_url,
    address to
  ) external override returns (uint256) {
    string memory gen_sn_id = string(
      abi.encodePacked(sn_name, sn_id)
    );

    require(
      _exists(_owned_accounts_by_gen_id[gen_sn_id]) == false,
      "OwnYourSocialNetwork: The account was already minted"
    );
    uint256 _token_id = _mint_with_owner(to);
    _owned_accounts_by_id[_token_id].id = _token_id;
    _owned_accounts_by_id[_token_id].owner = to;
    _owned_accounts_by_id[_token_id].sn_name = sn_name;
    _owned_accounts_by_id[_token_id].sn_id = sn_id;
    _owned_accounts_by_id[_token_id].sn_url = sn_url;

    _owned_accounts_by_gen_id[gen_sn_id] = _token_id;

    return _token_id;
  }

  function mintTwitter(
    string memory oauthToken,
    string memory oauthVerifier
  ) external payable {
    twitterMinter.startMint{ value: msg.value }(oauthToken, oauthVerifier, _msgSender(), this.mint);
  }
 
  function getOwnedAccountByToken(uint256 token_id) external view returns (OwnedAccount.data memory) {
    require(
      _exists(token_id),
      "OwnYourSocialNetwork: Get owned account query for nonexistent token"
    );

    return _owned_accounts_by_id[token_id];
  }

  function getOwnedAccountByGenSnId(string memory gen_sn_id) external view returns (OwnedAccount.data memory) {
    require(
      _exists(_owned_accounts_by_gen_id[gen_sn_id]),
      "OwnYourSocialNetwork: The account was not yet minted"
    );

    return _owned_accounts_by_id[_owned_accounts_by_gen_id[gen_sn_id]];
  }

  // function updateTwitterMinterAddress(address twitterMinterAddress) external {
  //   require(
  //     hasRole(MINTER_ROLE, _msgSender()),
  //     "OwnYourSocialNetwork: must have minter role to mint"
  //   );

  //   twitterMinter = TwitterMinter(twitterMinterAddress);
  // }
}