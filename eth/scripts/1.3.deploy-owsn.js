const { ethers, upgrades, network } = require("hardhat");
const { writeLock, verifyNoLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");
const { getBaseUri } = require("./utils/baseUri");

async function main() {
  const NAME = "OwnYourSocialNetwork";
  const SYMBOL = "OWSN";

  verifyNoLock(network.name, NAME);

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const tm = getLock(network.name, "TwitterMinter");

  const owsn = await upgrades.deployProxy(OwnYourSocialNetwork, [
    NAME,
    SYMBOL,
    getBaseUri(network.name),
  ]);
  await owsn.deployed();
  await owsn.setTwitterMinterAddress(tm.address);

  writeLock(network.name, NAME, owsn.address);
  console.log(`${NAME} deployed to:`, owsn.address);

  populateAbiToApi(NAME, SYMBOL, undefined, network.name);
  replaceAddressInApi(SYMBOL, owsn.address, network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
