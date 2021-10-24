const Web3 = require("web3");
const { getAccessToken } = require("./twitter");
const taoAbi = require("../abi/TwitterAuthOracle.json");

const web3 = new Web3(process.env.WEB3_URL);
const taoContract = new web3.eth.Contract(taoAbi.abi, process.env.TAO_CONTRACT);
const account = web3.eth.accounts.privateKeyToAccount(
  `0x${process.env.DEPLOYER_PRIVATE_KEY}`
);

const handleOffChainError = (error) => {
  console.error(error);
};

const handleNewPendingRequest = async (error, event) => {
  if (error) {
    handleOffChainError(error);
    return;
  }

  try {
    const { requestId } = event.returnValues;
    console.log(`Received request [requestId=${requestId}]`);

    await taoContract.methods.startProcessing(requestId).send({
      from: account.address,
    });

    try {
      const request = await taoContract.methods
        .getRequestById(requestId)
        .call({ sender: account.address });

      const accessToken = await getAccessToken({
        oauthToken: request.oauthToken,
        oauthVerifier: request.oauthVerifier,
      });

      console.log(accessToken);
      await taoContract.methods.succeeded(
        requestId,
        accessToken.screen_name,
        accessToken.user_id
      );
    } catch (err) {
      handleOffChainError(err);
      await taoContract.methods.failed(requestId, String(err.message));
    }
  } catch (err) {
    handleOffChainError(err);
  }
};

const start = async () => {
  taoContract.events
    .NewPendingRequest(handleNewPendingRequest)
    .on("connected", () => {
      console.log(
        `Listening for NewPendingRequest event of TAO contract at ${process.env.TAO_CONTRACT}`
      );
    });
};

module.exports = {
  start,
};
