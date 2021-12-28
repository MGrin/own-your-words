const { getLock } = require("../scripts/utils/locks");

const NAME = "TwitterMinter";

task("TM:isAvailable", "Is Twitter OWSN Available in TM contract")
  .addParam("snid", "SN id")
  .setAction(async ({ snid }, hre) => {
    const tmLock = getLock(network.name, NAME);
    const TM = await hre.ethers.getContractFactory(NAME);
    const tm = await TM.attach(tmLock.address);

    console.log(await tm.isAvailable(snid));
  });

task("TM:tokenExists", "Is OWSN Token available in TM contract")
  .addParam("id", "Token id")
  .setAction(async ({ id }, hre) => {
    const tmLock = getLock(network.name, NAME);
    const TM = await hre.ethers.getContractFactory(NAME);
    const tm = await TM.attach(tmLock.address);

    console.log(await tm.tokenExists(id));
  });

task("TM:getOWNSBySnId", "Get OWSN by SnId from TM contract")
  .addParam("snid", "SN id")
  .setAction(async ({ snid }, hre) => {
    const tmLock = getLock(network.name, NAME);
    const TM = await hre.ethers.getContractFactory(NAME);
    const tm = await TM.attach(tmLock.address);

    console.log(await tm.getOWNSBySnId(snid));
  });

task("TM:getOWSNByTokenId", "Get OWSN by token id from TM contract")
  .addParam("id", "Token id")
  .setAction(async ({ id }, hre) => {
    const tmLock = getLock(network.name, NAME);
    const TM = await hre.ethers.getContractFactory(NAME);
    const tm = await TM.attach(tmLock.address);

    console.log(await tm.getOWSNByTokenId(id));
  });
