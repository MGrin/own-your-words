// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Custom.sol";
import "./TwitterAuthOracle.sol";


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

  function getVersion() external pure returns (string memory) {
    return "1.0.0";
  }

  mapping(string => uint256) private _owned_accounts_by_gen_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;

  TwitterAuthOracle private twitterOracle;

  event TwitterAuthRequestSubmited(
    address indexed sender, uint256 requestId
  );

  event TwitterAuthRequestSucceeded(
    uint256 indexed requestId,
    uint256 tokenId
  );

  event TwitterAuthRequestFailed(
    uint256 indexed requestId,
    string error
  );

  /////////////////////////////////////////////////////////////////////////////////////

  function __OwnYourSocialNetwork__init(string memory name, string memory symbol, address twitterOracleAddress) initializer public  {
    __ERC721Custom_init(name, symbol);
    twitterOracle = TwitterAuthOracle(twitterOracleAddress);
  }

  function mint(
    string memory sn_name,
    string memory sn_id,
    string memory sn_url
  ) private returns (uint256) {
    string memory gen_sn_id = string(
      abi.encodePacked(sn_name, sn_id)
    );

    require(
      _exists(_owned_accounts_by_gen_id[gen_sn_id]) == false,
      "OwnYourSocialNetwork: The account was already minted"
    );
    uint256 _token_id = _mint_without_owner(_msgSender());
    _owned_accounts_by_id[_token_id].id = _token_id;
    _owned_accounts_by_id[_token_id].owner = _msgSender();
    _owned_accounts_by_id[_token_id].sn_name = sn_name;
    _owned_accounts_by_id[_token_id].sn_id = sn_id;
    _owned_accounts_by_id[_token_id].sn_url = sn_url;

    _owned_accounts_by_gen_id[gen_sn_id] = _token_id;

    return _token_id;
  }

  function mintTwitterAccountStart(
    string memory oauthToken,
    string memory oauthVerifier
  ) external payable {
    uint256 reqId = twitterOracle.request{value: msg.value}(oauthToken, oauthVerifier, this.mintTwitterAccountSuccess, this.mintTwitterAccountFail);
    emit TwitterAuthRequestSubmited(_msgSender(), reqId);
  }

  function mintTwitterAccountSuccess(
    TwitterAuthData.Response memory res
  ) external {
    require(
      hasRole(MINTER_ROLE, _msgSender()),
      "ERC721Custom: must have minter role to mint"
    );
    
    uint256 tokenId = mint("twitter", res.userId, string(abi.encodePacked("https://twitter.com/", res.screenName)));
    emit TwitterAuthRequestSucceeded(res.requestId, tokenId);
  }

  function mintTwitterAccountFail(
    uint256 reqId,
    string memory err
  ) external {
    require(
      hasRole(MINTER_ROLE, _msgSender()),
      "ERC721Custom: must have minter role to mint"
    );
    
    emit TwitterAuthRequestFailed(reqId, err);
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
}