// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMinter.sol";
import "../oracles/TwitterPostOracle.sol";
import "../utils/OwnedWords.sol";

library TwitterPostMintState {
  struct SuccessCallback {
    function (
      address
    ) external returns (uint256) cb;
  }
}

contract TwitterPostMinter is AccessControl, IMinter {
  using TwitterPostMintState for TwitterPostMintState.SuccessCallback;
  using OwnedWords for OwnedWords.data;
  using OwnedWords for OwnedWords.availability;

  TwitterPostOracle public oracle;
  mapping(uint256 => TwitterPostMintState.SuccessCallback) private _callback_by_req_id;
  mapping(string => OwnedWords.availability) private _owned_words_by_sn_id;
  mapping(uint256 => OwnedWords.data) private _owned_words_by_id;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
  bytes32 public constant snName = keccak256("twitter");

  event TwitterPostRequestSubmited(
    address indexed sender, uint256 requestId
  );

  event TwitterPostRequestSucceeded(
    uint256 indexed requestId,
    uint256 tokenId
  );

  event TwitterPostRequestFailed(
    uint256 indexed requestId,
    string error
  );

  constructor(address twitterPostOracleAddress) AccessControl() {
    oracle = TwitterPostOracle(twitterPostOracleAddress);
  
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
    _setRoleAdmin(ADMIN_ROLE, USER_ROLE);
    grantRole(USER_ROLE, twitterPostOracleAddress);
  }

  function startMint(
    string memory postId,
    address owner,
    function (
      address
    ) external returns (uint256) cb
  ) external payable {
    uint256 reqId = oracle.request{value: msg.value}(postId, owner, this.succeedMint, this.failMint);
    _callback_by_req_id[reqId] = TwitterPostMintState.SuccessCallback(cb);
    emit TwitterPostRequestSubmited(owner, reqId);
  }

  function succeedMint(
    TwitterPostData.Response memory res
  ) external onlyRole(USER_ROLE) {    
    uint256 tokenId = _callback_by_req_id[res.requestId].cb(
      res.owner
    );
    _owned_words_by_id[tokenId].id = tokenId;
    _owned_words_by_id[tokenId].sn_name = "twitter";
    _owned_words_by_id[tokenId].post_id = res.postId;
    _owned_words_by_id[tokenId].post_url = res.postUrl;

    _owned_words_by_sn_id[res.postId].id = tokenId;
    _owned_words_by_sn_id[res.postId].stored = true;

    emit TwitterPostRequestSucceeded(res.requestId, tokenId);
  }

  function failMint(
    uint256 reqId,
    string memory err
  ) external override onlyRole(USER_ROLE) {    
    emit TwitterPostRequestFailed(reqId, err);
  }

  function isAvailable(string memory sn_id) public view override returns (bool) {
    OwnedWords.availability memory availability = _owned_words_by_sn_id[sn_id];

    return !availability.stored;
  }

  function tokenExists(uint256 token_id) public view override returns (bool) {
    OwnedWords.data memory oww =  _owned_words_by_id[token_id];
    return getSnName() == keccak256(abi.encodePacked(oww.sn_name));
  }

  function getOWWBySnId(string memory sn_id) public view returns (OwnedWords.data memory) {
    require(!isAvailable(sn_id), "TwitterPostMinter: Post was not yet minted");
    uint256 tokenId = _owned_words_by_sn_id[sn_id].id;

    return _owned_words_by_id[tokenId];
  }

  function getOWWByTokenId(uint256 tokenId) public view returns (OwnedWords.data memory) {
    require(tokenExists(tokenId), "TwitterPostMinter: Post was not yet minted");
    return _owned_words_by_id[tokenId];
  }

  function getPriceWEI() public view override returns (uint256) {
    return oracle.priceWEI();
  }

  function retrieveFunds() public override onlyRole(ADMIN_ROLE) {
    payable(_msgSender()).transfer(address(this).balance);
  }

  function setTwitterPostOracle(address twitterPostOracleAddress) public onlyRole(ADMIN_ROLE) {
    revokeRole(USER_ROLE, address(oracle));
    oracle = TwitterPostOracle(twitterPostOracleAddress);
    grantRole(USER_ROLE, twitterPostOracleAddress);
  }

  function getSnName() public pure override returns(bytes32) {
    return snName;
  }
}