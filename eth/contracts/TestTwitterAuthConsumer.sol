// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TwitterAuthOracle.sol";

contract TestTwitterAuthConsumer {
  TwitterAuthOracle private oracle;

  TwitterAuthData.Response public response;
  string public err;
  uint256 public requestId;

  constructor(address twitterAuthOracleAddress) {
    oracle = TwitterAuthOracle(twitterAuthOracleAddress);
  }

  function sendRequest(
    string memory oauthToken,
    string memory oauthVerifier
  ) external payable {
    uint256 reqId = oracle.request{value: msg.value}(oauthToken, oauthVerifier, this.handleResponse, this.handleError);
    requestId = reqId;
  }

  function handleResponse(TwitterAuthData.Response memory res) external {
    response = res;
  }

  function handleError(uint256 reqId, string memory e) external {
    requestId = reqId;
    err = e;
  }
}