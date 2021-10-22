// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

library TwitterAuthData {
  struct Response {
    uint256 requestId;
    string screenName;
    string userId;
  }

  struct Request {
    address owner;

    string oauthToken;
    string oauthVerifier;

    function (TwitterAuthData.Response memory) external successCallback;
    function (uint256, string memory) external failureCallback;

    uint8 status; // 1 - pending, 2 - processing, 3 - success, 4 - error
    string err;
  }
}

contract TwitterAuthOracle is Ownable {
  using TwitterAuthData for TwitterAuthData.Request;
  using TwitterAuthData for TwitterAuthData.Response;
  using Counters for Counters.Counter;

  uint256 public priceWEI;
  
  mapping(uint256 => TwitterAuthData.Request) private requests;

  Counters.Counter private counter;
  
  event NewPendingRequest (
    uint256 requestId
  );

  constructor() Ownable() {
    priceWEI = 0.005 * 1e18;
  }

  function request(
    string memory oauthToken,
    string memory oauthVerifier,
    function (TwitterAuthData.Response memory) external successCallback,
    function (uint256, string memory) external failureCallback
  ) public payable returns (uint256) {
    require(msg.value == priceWEI, "Please send enought ETH for the request");

    TwitterAuthData.Request memory req;

    uint256 id = counter.current();
    counter.increment();

    req.owner = _msgSender();
    req.oauthToken = oauthToken;
    req.oauthVerifier = oauthVerifier;
    req.successCallback = successCallback;
    req.failureCallback = failureCallback;
    req.status = 1;

    requests[id] = req;

    emit NewPendingRequest(id);
    return id;
  }

  function startProcessing(uint256 id) external onlyOwner {
    require(requests[id].status == 1, "Request with provided id is not in pending state, or does not exist");
    requests[id].status = 2;
  }

  function succeeded(
    uint256 id,
    string memory screenName,
    string memory userId
  ) external onlyOwner {
    require(requests[id].status == 2, "Request with provided id is not in processing state, or does not exist");

    TwitterAuthData.Response memory res;
    res.requestId = id;
    res.screenName = screenName;
    res.userId = userId;

    requests[id].status = 3;
    requests[id].successCallback(res);
  }

  function failed(uint256 id, string memory err) external onlyOwner {
    require(requests[id].status == 2, "Request with provided id is not in processing state, or does not exist");

    requests[id].status = 4;
    requests[id].err = err;
    requests[id].failureCallback(id, err);
  }


  function setPriceETH(uint256 _priceWEI) external onlyOwner {
    priceWEI = _priceWEI;
  }
}