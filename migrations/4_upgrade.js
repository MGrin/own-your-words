const OWW = artifacts.require("OwnedWords");

const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

const proxyAddresses = {
  rinkeby: "0x0Ce8a1c48b67F851685Be58C8F980207404ADedB",
};
module.exports = async function (deployer, network) {
  const proxyAddress = proxyAddresses[network];
  if (!proxyAddress) {
    return;
  }
  await prepareUpgrade(proxyAddresses[network], OWW, { deployer });
};
