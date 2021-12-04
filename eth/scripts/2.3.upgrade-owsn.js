const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToWeb, populateAbiToApi } = require("./utils/abi");
const { replaceAddressInWeb } = require("./utils/env");
const { getBaseUri } = require("./utils/baseUri");
async function main() {
  const NAME = "OwnYourSocialNetwork";
  const SYMBOL = "OWSN";

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const tm = getLock(network.name, "TwitterMinter");
  const existingDeployment = getLock(network.name, NAME);

  const owsn = await upgrades.upgradeProxy(
    existingDeployment.address,
    OwnYourSocialNetwork,
    [NAME, SYMBOL, getBaseUri(network.name)],
    { initializer: "__OwnYourSocialNetwork__init" }
  );
  await owsn.deployed();
  await owsn.updateTwitterMinterAddress(tm.address);

  writeLock(network.name, NAME, owsn.address);
  console.log(`${NAME} deployed to:`, owsn.address);

  populateAbiToWeb(NAME);
  populateAbiToApi(NAME);
  replaceAddressInWeb(network.name, SYMBOL, owsn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
