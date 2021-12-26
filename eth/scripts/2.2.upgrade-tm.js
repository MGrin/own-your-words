const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "TwitterMinter";
  const SYMBOL = "TM";

  const TwitterMinter = await ethers.getContractFactory(NAME);

  const tao = getLock(network.name, "TwitterAuthOracle");

  const tm = await TwitterMinter.deploy(tao.address);
  await tm.deployed();

  writeLock(network.name, NAME, tm.address);
  console.log(`${NAME} deployed to:`, tm.address);

  populateAbiToApi(NAME, SYMBOL, "minters/", network.name);
  replaceAddressInApi(SYMBOL, tm.address, network.name);

  const owsnLock = getLock(network.name, "OwnYourSocialNetwork");
  const OWSN = await ethers.getContractFactory("OwnYourSocialNetwork");
  const owsn = await OWSN.attach(owsnLock.address);
  await owsn.updateTwitterMinterAddress(tm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
