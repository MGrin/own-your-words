const { getLock } = require("../scripts/utils/locks");

const NAME = "DiscordAuthOracle";

task("getDAORequest", "Show DAO request state by id")
  .addParam("id", "Request id")
  .setAction(async ({ id }, hre) => {
    const daoLock = getLock(network.name, NAME);
    const DAO = await hre.ethers.getContractFactory(NAME);
    const tao = await DAO.attach(daoLock.address);

    console.log(await dao.getRequestById(id));
  });

task("getDAOOwner", "Show DAO contract owner").setAction(async (_, hre) => {
  const daoLock = getLock(network.name, NAME);
  const DAO = await hre.ethers.getContractFactory(NAME);
  const dao = await DAO.attach(daoLock.address);
  console.log(await dao.owner());
});
