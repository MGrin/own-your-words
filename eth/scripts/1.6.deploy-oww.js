const { ethers, upgrades, network } = require("hardhat");
const { writeLock, verifyNoLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");
const { getBaseUri } = require("./utils/baseUri");

async function main() {
  const NAME = "OwnYourWords";
  const SYMBOL = "OWW";

  verifyNoLock(network.name, NAME);

  const OwnYourWords = await ethers.getContractFactory(NAME);

  const tpm = getLock(network.name, "TwitterPostMinter");

  const oww = await upgrades.deployProxy(
    OwnYourWords,
    [NAME, SYMBOL, getBaseUri(network.name)],
    { initializer: "__OwnYourWords__init" }
  );
  await oww.deployed();
  await oww.updateTwitterPostMinterAddress(tpm.address);

  writeLock(network.name, NAME, oww.address);
  console.log(`${NAME} deployed to:`, oww.address);

  populateAbiToApi(NAME, SYMBOL, undefined, network.name);
  replaceAddressInApi(SYMBOL, oww.address, network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
