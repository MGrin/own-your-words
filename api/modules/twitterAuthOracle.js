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

const processRequest = async (requestId) => {
  try {
    await taoContract.methods.startProcessing(requestId).send({
      from: account.address,
    });

    const request = await taoContract.methods
      .getRequestById(requestId)
      .call({ sender: account.address });

    const accessToken = await getAccessToken({
      oauthToken: request.oauthToken,
      oauthVerifier: request.oauthVerifier,
    });

    await taoContract.methods
      .succeeded(requestId, accessToken.screen_name, accessToken.user_id)
      .send({ from: account.address });
  } catch (err) {
    handleOffChainError(err);
    await taoContract.methods
      .failed(requestId, String(err.message))
      .send({ from: account.address });
  }
};

const handleNewPendingRequestEvent = (subscribe) => async (error, event) => {
  if (error) {
    handleOffChainError(error);
    return;
  }

  try {
    const { requestId } = event.returnValues;
    console.log(
      `[NewPendingRequestEvent]: Received request [requestId=${requestId}]`
    );
    await processRequest(requestId);
    subscribe();
  } catch (err) {
    handleOffChainError(err);
  }
};

const start = async () => {
  const subscribe = () => {
    taoContract.once(
      "NewPendingRequest",
      ({
        fromBlock: "pending",
      },
      handleNewPendingRequestEvent(subscribe))
    );
  };

  subscribe();
  console.log(
    `Listening for NewPendingRequest event of TAO contract at ${process.env.TAO_CONTRACT}`
  );
};

module.exports = {
  start,
};
