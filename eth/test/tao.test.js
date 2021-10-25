const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TwitterAuthOracle and TwitterAuthConsumer", function () {
  let tao;
  let client;
  let owner;
  let addr1;

  this.beforeAll(async () => {
    const TwitterAuthOracle = await ethers.getContractFactory(
      "TwitterAuthOracle"
    );
    tao = await TwitterAuthOracle.deploy();
    await tao.deployed();

    const TestTwitterAuthConsumer = await ethers.getContractFactory(
      "TestTwitterAuthConsumer"
    );
    client = await TestTwitterAuthConsumer.deploy(tao.address);
    await client.deployed();

    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;
  });

  it("Should read a request call price", async () => {
    expect(await tao.priceWEI()).to.equal(0.005 * 1e18);
  });

  it("Should update the request call price by the owner", async () => {
    await tao.setPriceETH(0.007 * 1e18);
    expect(await tao.priceWEI()).to.equal(0.007 * 1e18);
    await tao.setPriceETH(0.005 * 1e18);
  });

  it("Should not update the request call price for non-owner", async () => {
    await expect(tao.connect(addr1).setPriceETH(0)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should be able to create a request and receive id as a result", async () => {
    let requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    let requestId = await client.connect(addr1).requestId();
    expect(requestId).to.equal(0);

    requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    requestId = await client.connect(addr1).requestId();
    expect(requestId).to.equal(1);
  });

  it("Should not be able to create a request with wrong eth amount", async () => {
    await expect(
      client.connect(addr1).sendRequest("aaa", "bbb")
    ).to.be.revertedWith("Please send enought ETH for the request");
    await expect(
      client.connect(addr1).sendRequest("aaa", "bbb", { value: 0.004 * 1e18 })
    ).to.be.revertedWith("Please send enought ETH for the request");
    await expect(
      client.connect(addr1).sendRequest("aaa", "bbb", { value: 0.006 * 1e18 })
    ).to.be.revertedWith("Please send enought ETH for the request");
  });

  it("Should fail trying to start processing an non-existing request", async () => {
    await expect(tao.startProcessing(4)).to.be.revertedWith(
      "Request with provided id is not in pending state, or does not exist"
    );
  });

  it("Should fail trying to start processing if not owner", async () => {
    await expect(tao.connect(addr1).startProcessing(0)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should return a request by id", async () => {
    const request = await tao.getRequestById(0);
    expect(request.owner).to.equal(addr1.address);
    expect(request.oauthToken).to.equal("aaa");
    expect(request.oauthVerifier).to.equal("bbb");
    expect(request.status).to.equal(1);
    expect(request.err).to.equal("");
  });

  it("Should not return a request by id if no owner", async () => {
    await expect(tao.connect(addr1).getRequestById(0)).to.be.revertedWith("");
  });

  it("Should not be able to succeed a request if not owner", async () => {
    await expect(tao.connect(addr1).succeeded(0, "a", "a")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not be able to succeed a non-existing request", async () => {
    await expect(tao.succeeded(4, "a", "a")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });

  it("Should not be able to succeed a non-started request", async () => {
    await expect(tao.succeeded(0, "a", "a")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });

  it("Should be able to succeed a started request", async () => {
    const txStart = await tao.startProcessing(0);
    await txStart.wait();

    const txSucceeded = await tao.succeeded(0, "a", "b");
    await txSucceeded.wait();

    const response = await client.response();
    expect(response.screenName).to.equal("a");
    expect(response.userId).to.equal("b");
    expect(response.requestId).to.equal(0);
    expect(response.owner).to.equal(addr1.address);
  });

  it("Should not be able to succeed an already succeeded request", async () => {
    await expect(tao.succeeded(0, "a", "a")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });

  it("Should not be able to fail a request if not owner", async () => {
    await expect(tao.connect(addr1).failed(0, "Error")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not be able to fail a non-existing request", async () => {
    await expect(tao.failed(4, "Error")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });

  it("Should not be able to fail a non-started request", async () => {
    await expect(tao.failed(0, "Error")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });

  it("Should be able to fail a started request", async () => {
    const txStart = await tao.startProcessing(1);
    await txStart.wait();

    const txFailed = await tao.failed(1, "Error");
    await txFailed.wait();

    const err = await client.err();
    expect(err).to.equal("Error");
  });

  it("Should not be able to fail an already failed request", async () => {
    await expect(tao.failed(0, "Error")).to.be.revertedWith(
      "Request with provided id is not in processing state, or does not exist"
    );
  });
});

describe("TwitterAuthOracle as queue", function () {
  let tao;
  let client;
  let owner;
  let addr1;

  this.beforeAll(async () => {
    const TwitterAuthOracle = await ethers.getContractFactory(
      "TwitterAuthOracle"
    );
    tao = await TwitterAuthOracle.deploy();
    await tao.deployed();

    const TestTwitterAuthConsumer = await ethers.getContractFactory(
      "TestTwitterAuthConsumer"
    );
    client = await TestTwitterAuthConsumer.deploy(tao.address);
    await client.deployed();

    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;
  });

  it("Should create a request and add it to the queue", async () => {
    let requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    let requestId = await client.connect(addr1).requestId();
    expect(requestId).to.equal(0);

    requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    requestId = await client.connect(addr1).requestId();
    expect(requestId).to.equal(1);

    requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    requestId = await client.connect(addr1).requestId();

    expect(requestId).to.equal(2);
    requestTx = await client.connect(addr1).sendRequest("aaa", "bbb", {
      value: 0.005 * 1e18,
    });
    await requestTx.wait();

    requestId = await client.connect(addr1).requestId();
    expect(requestId).to.equal(3);
  });

  it("Should not read the queue if not an owner", async () => {
    await expect(
      tao.connect(addr1).getPendingRequestsIdsFromQueue()
    ).to.be.revertedWith("");
  });

  it("Should return all pending requests from the queue", async () => {
    let startProcessingTx = await tao.startProcessing(0);
    await startProcessingTx.wait();

    startProcessingTx = await tao.startProcessing(2);
    await startProcessingTx.wait();

    const tx = await tao.getPendingRequestsIdsFromQueue();
    const receipt = await tx.wait();

    expect(receipt.events[0].args.count).to.equal(2);

    expect(receipt.events[0].args.requestsIds[0]).to.equal(1);
    expect(receipt.events[0].args.requestsIds[1]).to.equal(3);
  });

  it("Should return no requests from the queue if everything is done", async () => {
    const tx = await tao.getPendingRequestsIdsFromQueue();
    const receipt = await tx.wait();

    expect(receipt.events[0].args.count).to.equal(0);
  });

  // it("Should return the first pending request from the queue", async () => {
  //   const startProcessingTx = await tao.startProcessing(1);
  //   await startProcessingTx.wait();

  //   const tx = await tao.getPendingRequestIdFromQueue();
  //   const receipt = await tx.wait();

  //   expect(receipt.events[0].args.requestId).to.equal(2);
  // });
});
