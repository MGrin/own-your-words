// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMinter.sol";
import "../oracles/TwitterAuthOracle.sol";
import "../utils/OwnedAccount.sol";

library TwitterMintState {
  struct SuccessCallback {
    function (
      address
    ) external returns (uint256) cb;
  }
}

contract TwitterMinter is AccessControl, IMinter {
  using TwitterMintState for TwitterMintState.SuccessCallback;
  using OwnedAccount for OwnedAccount.data;
  using OwnedAccount for OwnedAccount.availability;

  TwitterAuthOracle public oracle;

  mapping(uint256 => TwitterMintState.SuccessCallback) private _callback_by_req_id;
  mapping(string => OwnedAccount.availability) private _owned_accounts_by_sn_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
  bytes32 public constant snName = keccak256("twitter");
  
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

  constructor(address twitterAuthOracleAddress) AccessControl() {
    oracle = TwitterAuthOracle(twitterAuthOracleAddress);
  
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
    _setRoleAdmin(ADMIN_ROLE, USER_ROLE);
    grantRole(USER_ROLE, twitterAuthOracleAddress);
  }

  function startMint(
    string memory oauthToken,
    string memory oauthVerifier,
    address owner,
    function (
      address
    ) external returns (uint256) cb
  ) external payable {
    uint256 reqId = oracle.request{value: msg.value}(oauthToken, oauthVerifier, owner, this.succeedMint, this.failMint);
    _callback_by_req_id[reqId] = TwitterMintState.SuccessCallback(cb);
    emit TwitterAuthRequestSubmited(owner, reqId);
  }

  function succeedMint(
    TwitterAuthData.Response memory res
  ) external onlyRole(USER_ROLE) {    
    uint256 _token_id = _callback_by_req_id[res.requestId].cb(
      res.owner
    );

    _owned_accounts_by_id[_token_id].id = _token_id;
    _owned_accounts_by_id[_token_id].sn_name = "twitter";
    _owned_accounts_by_id[_token_id].sn_id = res.userId;
    _owned_accounts_by_id[_token_id].sn_url = string(abi.encodePacked("https://twitter.com/", res.screenName));

    _owned_accounts_by_sn_id[res.userId].id = _token_id;
    _owned_accounts_by_sn_id[res.userId].stored = true;

    emit TwitterAuthRequestSucceeded(res.requestId, _token_id);
  }

  function failMint(
    uint256 reqId,
    string memory err
  ) external override onlyRole(USER_ROLE) {    
    emit TwitterAuthRequestFailed(reqId, err);
  }

  function isAvailable(string memory sn_id) public view override returns (bool) {
    OwnedAccount.availability memory availability = _owned_accounts_by_sn_id[sn_id];

    return !availability.stored;
  }

  function tokenExists(uint256 token_id) public view override returns (bool) {
    OwnedAccount.data memory owsn =  _owned_accounts_by_id[token_id];
    return getSnName() == keccak256(abi.encodePacked(owsn.sn_name));
  }

  function getOWNSBySnId(string memory sn_id) public view returns (OwnedAccount.data memory) {
    require(!isAvailable(sn_id), "TwitterMinter: Account was not yet minted");
    uint256 tokenId = _owned_accounts_by_sn_id[sn_id].id;

    return _owned_accounts_by_id[tokenId];
  }

  function getOWSNByTokenId(uint256 tokenId) public view returns (OwnedAccount.data memory) {
    require(tokenExists(tokenId), "TwitterMinter: Account was not yet minted");
    return _owned_accounts_by_id[tokenId];
  }

  function getPriceWEI() public view override returns (uint256) {
    return oracle.priceWEI();
  }

  function retrieveFunds() public override onlyRole(ADMIN_ROLE) {
    payable(_msgSender()).transfer(address(this).balance);
  }

  function setTwitterAuthOracle(address twitterAuthOracleAddress) public onlyRole(ADMIN_ROLE) {
    revokeRole(USER_ROLE, address(oracle));
    oracle = TwitterAuthOracle(twitterAuthOracleAddress);
    grantRole(USER_ROLE, twitterAuthOracleAddress);
  }

  function getSnName() public pure override returns(bytes32) {
    return snName;
  }
}