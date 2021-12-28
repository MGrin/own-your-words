const { ethers, network } = require("hardhat");
const { getLock, writeLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

const NAME = "TwitterAuthOracle";
const SYMBOL = "TAO";

async function main() {
  const TwitterAuthOracle = await ethers.getContractFactory(NAME);

  const tao = await TwitterAuthOracle.deploy();
  await tao.deployed();

  writeLock(network.name, NAME, tao.address);
  console.log(`${NAME} deployed to:`, tao.address);

  populateAbiToApi(NAME, SYMBOL, "oracles/", network.name);
  replaceAddressInApi(SYMBOL, tao.address, network.name);

  try {
    const tmLock = getLock(network.name, "TwitterMinter");
    const TwitterMinter = await ethers.getContractFactory("TwitterMinter");
    const tm = await TwitterMinter.attach(tmLock.address);
    await tm.setTwitterAuthOracle(tao.address);
  } catch (e) {}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
