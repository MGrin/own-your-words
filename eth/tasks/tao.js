const { getLock } = require("../scripts/utils/locks");

const NAME = "TwitterAuthOracle";

task("getTAORequest", "Show TAO request state by id")
  .addParam("id", "Request id")
  .setAction(async ({ id }, hre) => {
    const taoLock = getLock(network.name, NAME);
    const TAO = await hre.ethers.getContractFactory(NAME);
    const tao = await TAO.attach(taoLock.address);

    console.log(await tao.getRequestById(id));
  });

task("getTAOOwner", "Show TAO contract owner").setAction(async (_, hre) => {
  const taoLock = getLock(network.name, NAME);
  const TAO = await hre.ethers.getContractFactory(NAME);
  const tao = await TAO.attach(taoLock.address);
  console.log(await tao.owner());
});
