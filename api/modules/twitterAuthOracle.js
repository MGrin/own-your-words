const { ethers } = require("ethers");
const { getAccessToken } = require("./twitter");
const taoAbi = require("../abi/TwitterAuthOracle.json");
const { handleOffChainError, mayFail } = require("../utils");

const PULL_TIMEOUT = 10 * 1000;

const provider = new ethers.providers.JsonRpcBatchProvider(
  process.env.WEB3_URL
);

const account = new ethers.Wallet(
  `0x${process.env.DEPLOYER_PRIVATE_KEY}`,
  provider
);

const taoContract = new ethers.Contract(
  process.env.TAO_CONTRACT,
  taoAbi.abi,
  provider
).connect(account);

const processRequest = async (requestId) => {
  console.log(`[processRequest] Processing request [requestId=${requestId}]`);
  let startTx;
  try {
    startTx = await mayFail(taoContract, "startProcessing", requestId);
    const request = await taoContract.getRequestById(requestId);

    const accessToken = await getAccessToken({
      oauthToken: request.oauthToken,
      oauthVerifier: request.oauthVerifier,
    });

    await startTx.wait();
    const succeedTx = await mayFail(
      taoContract,
      "succeeded",
      requestId,
      accessToken.screen_name,
      accessToken.user_id
    );
    await succeedTx.wait();
  } catch (err) {
    handleOffChainError(err);
    if (startTx) {
      await startTx.wait();
    }
    const failedTx = await mayFail(
      taoContract,
      "failed",
      requestId,
      String(err.message)
    );
    await failedTx.wait();
  }
};

const handleNewPendingRequestEvent = async (requestId) => {
  try {
    console.log(
      `[NewPendingRequestEvent]: Received request [requestId=${requestId}]`
    );
    await processRequest(requestId);
  } catch (err) {
    handleOffChainError(err);
  }
};

const pullPendingRequests = async (pull) => {
  try {
    const pendingRequestsCount =
      await taoContract.callStatic.getPendingRequestsIdsFromQueue();

    console.log(
      `[pullPendingRequests]: Pending requests count: ${pendingRequestsCount}`
    );
    if (pendingRequestsCount === 0) {
      return pull();
    }

    const tx = await taoContract.getPendingRequestsIdsFromQueue();
    const receipt = await tx.wait();

    const requestsIds = [];
    for (let i = 0; i < receipt.events[0].args.count; i++) {
      requestsIds.push(receipt.events[0].args.requestsIds[i]);
    }

    const requestsProcessing = requestsIds.map(async (requestId) => {
      try {
        processRequest(requestId);
      } catch (err) {
        handleOffChainError(err);
      }
    });
    await Promise.all(requestsProcessing);
  } catch (err) {
    handleOffChainError(err);
  }

  return pull();
};

const start = async () => {
  const pull = () => {
    setTimeout(() => {
      pullPendingRequests(pull);
    }, PULL_TIMEOUT);
  };

  taoContract.on("NewPendingRequest", handleNewPendingRequestEvent);
  console.log(
    `Listening for NewPendingRequest event of TAO contract at ${process.env.TAO_CONTRACT}`
  );

  pull();
  console.log(
    `Pulling pending requests from TAO contract at ${
      process.env.TAO_CONTRACT
    } every ${PULL_TIMEOUT / 1000}s.`
  );
};

module.exports = {
  start,
};
