const { ethers, upgrades, network } = require("hardhat");

const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "DiscordMinter";
  const SYMBOL = "DM";

  const DiscordMinter = await ethers.getContractFactory(NAME);

  const dao = getLock(network.name, "DiscordAuthOracle");

  const dm = await DiscordMinter.deploy(dao.address);
  await dm.deployed();

  writeLock(network.name, NAME, dm.address);
  console.log(`${NAME} deployed to:`, dm.address);

  populateAbiToApi(NAME, SYMBOL, "minters/", network.name);
  replaceAddressInApi(SYMBOL, dm.address, network.name);

  try {
    const owsnLock = getLock(network.name, "OwnYourSocialNetwork");
    const OWSN = await ethers.getContractFactory("OwnYourSocialNetwork");
    const owsn = await OWSN.attach(owsnLock.address);
    await owsn.setDiscordMinterAddress(dm.address);
  } catch (e) {}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
