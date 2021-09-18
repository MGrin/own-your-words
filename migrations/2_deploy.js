// const SNO = artifacts.require("SocialNetworkOwnership");
const OWW = artifacts.require("OwnedWords");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  await deployProxy(OWW, { deployer });
};
