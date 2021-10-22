const { ethers, network } = require("hardhat");
const { writeLock } = require("./utils");

async function main() {
  const NAME = "TwitterAuthOracle";
  const TwitterAuthOracle = await ethers.getContractFactory(NAME);

  const tao = await TwitterAuthOracle.deploy();
  await tao.deployed();

  writeLock(network.name, NAME, tao.address);
  console.log(`${NAME} deployed to:`, tao.address);
}

module.exports = {
  main,
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
