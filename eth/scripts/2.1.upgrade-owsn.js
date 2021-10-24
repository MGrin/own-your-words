const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToWeb } = require("./utils/abi");
const { replaceAddressInWeb } = require("./utils/env");

async function main() {
  const NAME = "OwnYourSocialNetwork";
  const SYMBOL = "OWSN";

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const tmLock = getLock(network.name, "TwitterMinter");
  const existingDeployment = getLock(network.name, NAME);

  const owsn = await upgrades.upgradeProxy(
    existingDeployment.address,
    OwnYourSocialNetwork,
    [NAME, SYMBOL, tmLock.address],
    { initializer: "__OwnYourSocialNetwork__init" }
  );
  await owsn.deployed();

  writeLock(network.name, NAME, owsn.address);
  console.log(`${NAME} deployed to:`, owsn.address);

  populateAbiToWeb(NAME);
  replaceAddressInWeb(network.name, SYMBOL, owsn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
