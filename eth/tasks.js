const { getLock } = require("./scripts/utils/locks");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("getTAORequest", "Show TAO request state by id")
  .addParam("id", "Request id")
  .setAction(async ({ id }, hre) => {
    const taoLock = getLock(network.name, "TwitterAuthOracle");
    const TAO = await hre.ethers.getContractFactory("TwitterAuthOracle");
    const tao = await TAO.attach(taoLock.address);

    console.log(await tao.getRequestById(id));
  });

task("getTPORequest", "Show TPO request state by id")
  .addParam("id", "Request id")
  .setAction(async ({ id }, hre) => {
    const tpoLock = getLock(network.name, "TwitterPostOracle");
    const TPO = await hre.ethers.getContractFactory("TwitterPostOracle");
    const tpo = await TPO.attach(tpoLock.address);

    console.log(await tpo.getRequestById(id));
  });

task("getTAOOwner", "Show TAO contract owner").setAction(async (_, hre) => {
  const taoLock = getLock(network.name, "TwitterAuthOracle");
  const TAO = await hre.ethers.getContractFactory("TwitterAuthOracle");
  const tao = await TAO.attach(taoLock.address);
  console.log(await tao.owner());
});

task("isOWSNAvailable", "Is OWSN available by gensnid")
  .addParam("gensnid", "OWSN gensnid")
  .setAction(async ({ gensnid }, hre) => {
    const owsnLock = getLock(network.name, "OwnYourSocialNetwork");
    const OWSN = await hre.ethers.getContractFactory("OwnYourSocialNetwork");
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.isAccountAvailable(gensnid));
  });

task("getOWSNToken", "Get OWSN Token by id")
  .addParam("token", "OWSN token id")
  .setAction(async ({ token }, hre) => {
    const owsnLock = getLock(network.name, "OwnYourSocialNetwork");
    const OWSN = await hre.ethers.getContractFactory("OwnYourSocialNetwork");
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.getOWSNByTokenId(token));
  });

task("isOWWAvailable", "Is OWW available by gensnid")
  .addParam("gensnid", "OWW gensnid")
  .setAction(async ({ gensnid }, hre) => {
    const owwLock = getLock(network.name, "OwnYourWords");
    const OWW = await hre.ethers.getContractFactory("OwnYourWords");
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.isPostAvailable(gensnid));
  });

task("getOWWToken", "Get OWW Token by id")
  .addParam("token", "OWW token id")
  .setAction(async ({ token }, hre) => {
    const owwLock = getLock(network.name, "OwnYourWords");
    const OWW = await hre.ethers.getContractFactory("OwnYourWords");
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.getOWWByTokenId(token));
  });

task("fund", "Send 1 eth to a given address")
  .addParam("to", "Address")
  .setAction(async ({ to }, hre) => {
    const accounts = await hre.ethers.getSigners();

    await accounts[0].sendTransaction({
      to,
      value: ethers.utils.parseEther("1.0"),
    });
  });

task("setOraclePrice", "Changes the oracle commission price")
  .addParam("oracle", "Oracle name")
  .addParam("price", "New price")
  .setAction(async ({ oracle, price }, hre) => {
    // setPriceETH
    const accounts = await hre.ethers.getSigners();

    const Oracle = await hre.ethers.getContractFactory(oracle);
    const lock = getLock(hre.network.name, oracle);
    const oracleInstance = (await Oracle.attach(lock.address)).connect(
      accounts[0]
    );

    const ethPrice = hre.ethers.utils.parseEther(price);
    await oracleInstance.setPriceETH(ethPrice);
  });

task("getBalance", "Get OWSN balance for owner address")
  .addParam("owner", "Owner address")
  .setAction(async ({ owner }, hre) => {
    const owsnLock = getLock(network.name, "OwnYourSocialNetwork");
    const OWSN = await hre.ethers.getContractFactory("OwnYourSocialNetwork");
    const owsn = await OWSN.attach(owsnLock.address);
    // console.log(owsn);
    console.log((await owsn.balanceOf(owner)).toString());
  });

task("getTokenUri", "Get token URI")
  .addParam("contract", "Contract name")
  .addParam("token", "Token id")
  .setAction(async ({ contract, token }, hre) => {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory(contract);
    const lock = getLock(hre.network.name, contract);
    const contractInstance = (await Contract.attach(lock.address)).connect(
      accounts[0]
    );

    console.log(await contractInstance.tokenURI(token));
  });
