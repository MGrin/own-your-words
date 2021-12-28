// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMinter.sol";
import "../oracles/DiscordAuthOracle.sol";
import "../utils/OwnedAccount.sol";

library DiscordMintState {
  struct SuccessCallback {
    function (
      address
    ) external returns (uint256) cb;
  }
}

contract DiscordMinter is AccessControl, IMinter {
  using DiscordMintState for DiscordMintState.SuccessCallback;
  using OwnedAccount for OwnedAccount.data;
  using OwnedAccount for OwnedAccount.availability;

  DiscordAuthOracle public oracle;

  mapping(uint256 => DiscordMintState.SuccessCallback) private _callback_by_req_id;
  mapping(string => OwnedAccount.availability) private _owned_accounts_by_sn_id;
  mapping(uint256 => OwnedAccount.data) private _owned_accounts_by_id;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
  bytes32 public constant snName = keccak256("discord");
  
  event DiscordAuthRequestSubmited(
    address indexed sender, uint256 requestId
  );

  event DiscordAuthRequestSucceeded(
    uint256 indexed requestId,
    uint256 tokenId
  );

  event DiscordAuthRequestFailed(
    uint256 indexed requestId,
    string error
  );

  constructor(address DiscordAuthOracleAddress) AccessControl() {
    oracle = DiscordAuthOracle(DiscordAuthOracleAddress);
  
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
    _setRoleAdmin(ADMIN_ROLE, USER_ROLE);
    grantRole(USER_ROLE, DiscordAuthOracleAddress);
  }

  function startMint(
    string memory code,
    string memory redirectUrl,
    address owner,
    function (
      address
    ) external returns (uint256) cb
  ) external payable {
    uint256 reqId = oracle.request{value: msg.value}(code, redirectUrl, owner, this.succeedMint, this.failMint);
    _callback_by_req_id[reqId] = DiscordMintState.SuccessCallback(cb);
    emit DiscordAuthRequestSubmited(owner, reqId);
  }

  function succeedMint(
    DiscordAuthData.Response memory res
  ) external onlyRole(USER_ROLE) {    
    uint256 _token_id = _callback_by_req_id[res.requestId].cb(
      res.owner
    );

    _owned_accounts_by_id[_token_id].id = _token_id;
    _owned_accounts_by_id[_token_id].sn_name = "discord";
    _owned_accounts_by_id[_token_id].sn_id = res.userId;
    _owned_accounts_by_id[_token_id].sn_url = string(abi.encodePacked("https://discord.com/users/", res.userId));

    _owned_accounts_by_sn_id[res.userId].id = _token_id;
    _owned_accounts_by_sn_id[res.userId].stored = true;

    emit DiscordAuthRequestSucceeded(res.requestId, _token_id);
  }

  function failMint(
    uint256 reqId,
    string memory err
  ) external override onlyRole(USER_ROLE) {    
    emit DiscordAuthRequestFailed(reqId, err);
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
    require(!isAvailable(sn_id), "DiscordMinter: Account was not yet minted");
    uint256 tokenId = _owned_accounts_by_sn_id[sn_id].id;

    return _owned_accounts_by_id[tokenId];
  }

  function getOWSNByTokenId(uint256 tokenId) public view returns (OwnedAccount.data memory) {
    require(tokenExists(tokenId), "DiscordMinter: Account was not yet minted");
    return _owned_accounts_by_id[tokenId];
  }

  function getPriceWEI() public view override returns (uint256) {
    return oracle.priceWEI();
  }

  function retrieveFunds() public override onlyRole(ADMIN_ROLE) {
    payable(_msgSender()).transfer(address(this).balance);
  }

  function setDiscordAuthOracle(address DiscordAuthOracleAddress) public onlyRole(ADMIN_ROLE) {
    revokeRole(USER_ROLE, address(oracle));
    oracle = DiscordAuthOracle(DiscordAuthOracleAddress);
    grantRole(USER_ROLE, DiscordAuthOracleAddress);
  }

  function getSnName() public pure override returns(bytes32) {
    return snName;
  }
}