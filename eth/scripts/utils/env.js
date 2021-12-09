const fs = require("fs");
const API_PATH = "../api";

const replaceAddressInApi = (symbol, address, network) => {
  if (!fs.existsSync(API_PATH)) {
    throw new Error(`API project is not found at ${API_PATH}`);
  }

  const envFilePath = `${API_PATH}/.env`;
  const ecosystemFilePath = `${API_PATH}/ecosystem.config.js`;

  const existingEnvContent = fs.readFileSync(envFilePath).toString("utf-8");
  const existingEcosystemContent = fs
    .readFileSync(ecosystemFilePath)
    .toString("utf-8");

  const reToReplaceInEnv = new RegExp(
    `${symbol}_CONTRACT_${network.toUpperCase()}=.*`
  );

  const reToReplaceInEcosystem = new RegExp(
    `${symbol}_CONTRACT_${network.toUpperCase()}: .*`
  );

  const valueToInsertInEnv = `${symbol}_CONTRACT_${network.toUpperCase()}=${address}`;
  const valueToInsertInEcosystem = `${symbol}_CONTRACT_${network.toUpperCase()}: '${address}',`;

  const replacedEnvContent = existingEnvContent.replace(
    reToReplaceInEnv,
    valueToInsertInEnv
  );

  const replacedEcosystemContent = existingEcosystemContent.replace(
    reToReplaceInEcosystem,
    valueToInsertInEcosystem
  );

  fs.unlinkSync(envFilePath);
  fs.writeFileSync(envFilePath, replacedEnvContent);

  fs.unlinkSync(ecosystemFilePath);
  fs.writeFileSync(ecosystemFilePath, replacedEcosystemContent);
};

module.exports = {
  replaceAddressInApi,
};
