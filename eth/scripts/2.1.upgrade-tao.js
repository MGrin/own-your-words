const { ethers, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "TwitterAuthOracle";
  const SYMBOL = "TAO";
  const TwitterAuthOracle = await ethers.getContractFactory(NAME);

  const tao = await TwitterAuthOracle.deploy();
  await tao.deployed();

  writeLock(network.name, NAME, tao.address);
  console.log(`${NAME} deployed to:`, tao.address);
  populateAbiToApi(NAME, SYMBOL, "oracles/", network.name);
  replaceAddressInApi(SYMBOL, tao.address, network.name);

  const tmLock = getLock(network.name, "TwitterMinter");
  const TM = await ethers.getContractFactory("TwitterMinter");
  const tm = await TM.attach(tmLock.address);
  await tm.setTwitterAuthOracle(tao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
