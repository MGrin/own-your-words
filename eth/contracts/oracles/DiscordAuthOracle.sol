// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../utils/QueueUint256.sol";

library DiscordAuthData {
  struct Response {
    uint256 requestId;
    string userName;
    string userId;
    address owner;
  }

  struct Request {
    address owner;
    uint256 id;

    string code;
    string redirectUrl;

    function (DiscordAuthData.Response memory) external successCallback;
    function (uint256, string memory) external failureCallback;

    uint8 status; // 1 - pending, 2 - processing, 3 - success, 4 - error
    string err;
  }

  struct RequestSerialized {
    address owner;

    uint256 id;
    string code;
    string redirectUrl;

    uint8 status;
    string err;
  }
}

contract DiscordAuthOracle is Ownable {
  using DiscordAuthData for DiscordAuthData.Request;
  using DiscordAuthData for DiscordAuthData.Response;
  using DiscordAuthData for DiscordAuthData.RequestSerialized;

  using Counters for Counters.Counter;
  using QueueUints256Funs for QueueUints256;

  uint256 public priceWEI;
  
  mapping(uint256 => DiscordAuthData.Request) private requests;
  mapping(address => DiscordAuthData.RequestSerialized[]) private requestsByOwner;

  Counters.Counter private counter;
  QueueUints256 private pendingRequestsQueue;

  event NewPendingRequest (
    uint256 requestId
  );

  event RetrievePendingRequestsFromQueue (
    uint256[] requestsIds,
    uint8 count
  );

  constructor() Ownable() {
    priceWEI = 0.05 * 1e18;
    pendingRequestsQueue.create(200);
  }

  function request(
    string memory code,
    string memory redirectUrl,
    address owner,
    function (DiscordAuthData.Response memory) external successCallback,
    function (uint256, string memory) external failureCallback
  ) public payable returns (uint256) {
    require(msg.value == priceWEI, "Please send enought ETH for the request");

    DiscordAuthData.Request memory req;

    uint256 id = counter.current();
    counter.increment();

    req.id = id;
    req.owner = owner;
    req.code = code;
    req.redirectUrl = redirectUrl;
    req.successCallback = successCallback;
    req.failureCallback = failureCallback;
    req.status = 1;

    requests[id] = req;
    requestsByOwner[req.owner].push(serializeRequest(id));

    pendingRequestsQueue.append(id);

    emit NewPendingRequest(id);
    return id;
  }

  function startProcessing(uint256 id) external onlyOwner {
    require(requests[id].status == 1, "Request with provided id is not in pending state, or does not exist");
    requests[id].status = 2;
    requestsByOwner[requests[id].owner].push(serializeRequest(id));
  }

  function succeeded(
    uint256 id,
    string memory userName,
    string memory userId
  ) external onlyOwner {
    require(requests[id].status == 2, "Request with provided id is not in processing state, or does not exist");

    DiscordAuthData.Response memory res;
    res.requestId = id;
    res.userName = userName;
    res.userId = userId;
    res.owner = requests[id].owner;

    requests[id].status = 3;
    requests[id].successCallback(res);
    requestsByOwner[requests[id].owner].push(serializeRequest(id));
  }

  function failed(uint256 id, string memory err) external onlyOwner {
    require(requests[id].status == 2, "Request with provided id is not in processing state, or does not exist");

    requests[id].status = 4;
    requests[id].err = err;
    requests[id].failureCallback(id, err);
    requestsByOwner[requests[id].owner].push(serializeRequest(id));
  }

  function getRequestById(uint256 id) external view onlyOwner returns (DiscordAuthData.RequestSerialized memory) {
    require(requests[id].status > 0, "Request with provided id is not in processing state, or does not exist");
    return serializeRequest(id);
  }

  function getPendingRequestsIdsFromQueue() external onlyOwner returns (uint8 count){
    (uint256 requestId, bool havePendingRequests) = pendingRequestsQueue.remove();
    DiscordAuthData.Request memory req;
    uint256[] memory requestsIds = new uint256[](pendingRequestsQueue.size);
    uint8 pointer = 0;

    while (havePendingRequests) {
      req = requests[requestId];
      if (req.status == 1) {
        requestsIds[pointer] = req.id;
        pointer++;
      }

      (requestId, havePendingRequests) = pendingRequestsQueue.remove();
    }

    emit RetrievePendingRequestsFromQueue(requestsIds, pointer);
    return pointer;
  }

  function getMyRequests() external view returns(DiscordAuthData.RequestSerialized[] memory) {
    return requestsByOwner[_msgSender()];
  }

  function setPriceETH(uint256 _priceWEI) external onlyOwner {
    priceWEI = _priceWEI;
  }

  function serializeRequest(uint256 id) private view returns (DiscordAuthData.RequestSerialized memory) {
    DiscordAuthData.RequestSerialized memory req;

    req.id = requests[id].id;
    req.owner = requests[id].owner;
    req.code = requests[id].code;
    req.redirectUrl = requests[id].redirectUrl;
    req.status = requests[id].status;
    req.err = requests[id].err;

    return req;
  }

  function retrieveFunds() public onlyOwner {
    payable(_msgSender()).transfer(address(this).balance);
  }
}