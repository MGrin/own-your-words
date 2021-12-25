// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMinter.sol";
import "../oracles/TwitterPostOracle.sol";

library TwitterPostMintState {
  struct SuccessCallback {
    function (
      string memory,
      string memory,
      string memory,
      address
    ) external returns (uint256) cb;
  }
}

contract TwitterPostMinter is AccessControl, IMinter {
  using TwitterPostMintState for TwitterPostMintState.SuccessCallback;

  TwitterPostOracle public oracle;
  mapping(uint256 => TwitterPostMintState.SuccessCallback) private _callback_by_req_id;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

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
  
    _setupRole(ADMIN_ROLE, _msgSender());
    _setRoleAdmin(ADMIN_ROLE, USER_ROLE);
    _setupRole(USER_ROLE, twitterPostOracleAddress);
  }

  function startMint(
    string memory postId,
    address owner,
    function (
      string memory,
      string memory,
      string memory,
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
      "twitter",
      res.postId,
      res.postUrl,
      res.owner
    );
    emit TwitterPostRequestSucceeded(res.requestId, tokenId);
  }

  function failMint(
    uint256 reqId,
    string memory err
  ) external onlyRole(USER_ROLE) {    
    emit TwitterPostRequestFailed(reqId, err);
  }

  function getPriceWEI() public view override returns (uint256) {
    return oracle.priceWEI();
  }

  function retrieveFunds() public onlyRole(ADMIN_ROLE) {
    payable(_msgSender()).transfer(address(this).balance);
  }
}