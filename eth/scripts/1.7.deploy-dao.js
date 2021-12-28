const { ethers, network } = require("hardhat");
const { writeLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "DiscordAuthOracle";
  const SYMBOL = "DAO";
  const DiscordAuthOracle = await ethers.getContractFactory(NAME);

  const dao = await DiscordAuthOracle.deploy();
  await dao.deployed();

  writeLock(network.name, NAME, dao.address);
  console.log(`${NAME} deployed to:`, dao.address);

  populateAbiToApi(NAME, SYMBOL, "oracles/", network.name);
  replaceAddressInApi(SYMBOL, dao.address, network.name);

  try {
    const dmLock = getLock(network.name, "DiscordMinter");
    const DiscordMinter = await ethers.getContractFactory("DiscordMinter");
    const dm = await DiscordMinter.attach(dmLock.address);
    await dm.setTwitterAuthOracle(dao.address);
  } catch (e) {}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
