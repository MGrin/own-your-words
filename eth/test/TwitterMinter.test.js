const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TwitterMinter", function () {
  let minter;
  let owner;
  let addr1;

  this.beforeAll(async () => {
    const TwitterAuthOracle = await ethers.getContractFactory(
      "TwitterAuthOracle"
    );
    const tao = await TwitterAuthOracle.deploy();
    await tao.deployed();

    const TwitterMinter = await ethers.getContractFactory("TwitterMinter");
    minter = await TwitterMinter.deploy(tao.address);
    await minter.deployed();

    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;
  });

  it("Should return the minting price", async () => {
    const price = await minter.getPriceWEI();
    expect(price).to.equal(0.005 * 1e18);
  });
});
