// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMinter.sol";
import "../oracles/TwitterAuthOracle.sol";
import "../IOwnYourSocialNetwork.sol";

library TwitterMintState {
  struct SuccessCallback {
    function (
      string memory,
      string memory,
      string memory,
      address
    ) external returns (uint256) cb;
  }
}

contract TwitterMinter is Ownable, IMinter {
  using TwitterMintState for TwitterMintState.SuccessCallback;

  TwitterAuthOracle public oracle;
  mapping(uint256 => TwitterMintState.SuccessCallback) private _callback_by_req_id;

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

  constructor(address twitterAuthOracleAddress) Ownable() {
    oracle = TwitterAuthOracle(twitterAuthOracleAddress);
  }

  function startMint(
    string memory oauthToken,
    string memory oauthVerifier,
    address owner,
    function (
      string memory,
      string memory,
      string memory,
      address
    ) external returns (uint256) cb
  ) external payable {
    uint256 reqId = oracle.request{value: msg.value}(oauthToken, oauthVerifier, owner, this.succeedMint, this.failMint);
    _callback_by_req_id[reqId] = TwitterMintState.SuccessCallback(cb);
    emit TwitterAuthRequestSubmited(msg.sender, reqId);
  }

  function succeedMint(
    TwitterAuthData.Response memory res
  ) external onlyOwner {    
    uint256 tokenId = _callback_by_req_id[res.requestId].cb(
      "twitter",
      res.userId,
      string(abi.encodePacked("https://twitter.com/", res.screenName)),
      res.owner
    );
    emit TwitterAuthRequestSucceeded(res.requestId, tokenId);
  }

  function failMint(
    uint256 reqId,
    string memory err
  ) external onlyOwner {    
    emit TwitterAuthRequestFailed(reqId, err);
  }

  function getPriceWEI() public view override returns (uint256) {
    return oracle.priceWEI();
  }
}