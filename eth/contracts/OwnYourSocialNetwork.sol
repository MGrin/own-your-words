// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Custom.sol";
import "./minters/TwitterMinter.sol";

library OwnedAccount {
  struct data {
    uint256 id;

    string sn_name;
    string sn_id;
    string sn_url;
  }

  struct availability {
    uint256 id;
    bool stored;
  }
}

contract OwnYourSocialNetwork is ERC721Custom {
  using OwnedAccount for OwnedAccount.data;
  using OwnedAccount for OwnedAccount.availability;

  mapping(string => OwnedAccount.availability) private _owned_accounts_by_gen_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;
  TwitterMinter public twitterMinter;

  function __OwnYourSocialNetwork__init(string memory name, string memory symbol, string memory baseURI) initializer public  {
    __ERC721Custom_init(name, symbol, string(abi.encodePacked(baseURI, symbol)));
  }

  function mint(
    string memory sn_name,
    string memory sn_id,
    string memory sn_url,
    address to
  ) external returns (uint256) {
    string memory gen_sn_id = string(
      abi.encodePacked(sn_name, sn_id)
    );

    require(
      isAccountAvailable(gen_sn_id) == true,
      "OwnYourSocialNetwork: The account was already minted"
    );

    uint256 _token_id = _mint_with_owner(to);
    _owned_accounts_by_id[_token_id].id = _token_id;
    _owned_accounts_by_id[_token_id].sn_name = sn_name;
    _owned_accounts_by_id[_token_id].sn_id = sn_id;
    _owned_accounts_by_id[_token_id].sn_url = sn_url;

    _owned_accounts_by_gen_id[gen_sn_id].id = _token_id;
    _owned_accounts_by_gen_id[gen_sn_id].stored = true;

    return _token_id;
  }

  function mintTwitter(
    string memory oauthToken,
    string memory oauthVerifier
  ) external payable {
    twitterMinter.startMint{ value: msg.value }(oauthToken, oauthVerifier, _msgSender(), this.mint);
  }

  function isAccountAvailable(string memory gen_sn_id) public view returns (bool) {
    OwnedAccount.availability memory availability = _owned_accounts_by_gen_id[gen_sn_id];

    return !availability.stored;
  }

  function getOWSNByGenSnId(string memory gen_sn_id) public view returns (OwnedAccount.data memory) {
    require(
      !isAccountAvailable(gen_sn_id),
      "OwnYourSocialNetwork: The account was not yet minted"
    );

    uint256 tokenId = _owned_accounts_by_gen_id[gen_sn_id].id;
    return getOWSNByTokenId(tokenId);
  }

  function getOWSNByTokenId(uint256 tokenId) public view returns (OwnedAccount.data memory) {
    require(_exists(tokenId) == true, "OwnYourSocialNetwork: The account was not yet minted");

    return _owned_accounts_by_id[tokenId];
  }

  function updateTwitterMinterAddress(address twitterMinterAddress) public {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "OwnYourSocialNetwork: must have minter role to updateTwitterMinterAddress"
    );

    revokeRole(MINTER_ROLE, address(twitterMinter));
    twitterMinter = TwitterMinter(twitterMinterAddress);
    _setupRole(MINTER_ROLE, address(twitterMinterAddress));
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://rinkeby.oww-api.famio.app/OWSN/";
  }

}