const { getLock } = require("../scripts/utils/locks");

const NAME = "TwitterPostOracle";

task("getTPORequest", "Show TPO request state by id")
  .addParam("id", "Request id")
  .setAction(async ({ id }, hre) => {
    const tpoLock = getLock(network.name, NAME);
    const TPO = await hre.ethers.getContractFactory(NAME);
    const tpo = await TPO.attach(tpoLock.address);

    console.log(await tpo.getRequestById(id));
  });

task("getTPOOwner", "Show TPO contract owner").setAction(async (_, hre) => {
  const tpoLock = getLock(network.name, NAME);
  const TPO = await hre.ethers.getContractFactory(NAME);
  const tpo = await TPO.attach(tpoLock.address);
  console.log(await tpo.owner());
});
