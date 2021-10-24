const { ethers, upgrades, network } = require("hardhat");
const { writeLock, verifyNoLock, getLock } = require("./utils/locks");
const { populateAbiToWeb } = require("./utils/abi");

async function main() {
  const NAME = "TwitterMinter";
  const SYMBOL = "TM";

  const TwitterMinter = await ethers.getContractFactory(NAME);

  const taoLock = getLock(network.name, "TwitterAuthOracle");

  const tm = await TwitterMinter.deploy(taoLock.address);
  await tm.deployed();

  writeLock(network.name, NAME, tm.address);
  console.log(`${NAME} deployed to:`, tm.address);

  populateAbiToWeb(NAME, "minters/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
