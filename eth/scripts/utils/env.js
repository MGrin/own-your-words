const fs = require("fs");
const WEB_PATH = "../web";
const API_PATH = "../api";

const replaceAddressInWeb = (network, symbol, address) => {
  if (!fs.existsSync(WEB_PATH)) {
    throw new Error(`Web project is not found at ${WEB_PATH}`);
  }

  const envFilePath = `${WEB_PATH}/.env`;

  const existingEnvContent = fs.readFileSync(envFilePath).toString("utf-8");
  const reToReplace = new RegExp(
    `REACT_APP_${symbol}_CONTRACT_${network.toUpperCase()}=.*`
  );
  const valueToInsert = `REACT_APP_${symbol}_CONTRACT_${network.toUpperCase()}=${address}`;
  const replacedEnvContent = existingEnvContent.replace(
    reToReplace,
    valueToInsert
  );

  fs.unlinkSync(envFilePath);
  fs.writeFileSync(envFilePath, replacedEnvContent);
};

const replaceAddressInApi = (network, symbol, address) => {
  if (!fs.existsSync(API_PATH)) {
    throw new Error(`API project is not found at ${API_PATH}`);
  }

  const envFilePath = `${API_PATH}/.env`;

  const existingEnvContent = fs.readFileSync(envFilePath).toString("utf-8");
  const reToReplace = new RegExp(`${symbol}_CONTRACT=.*`);
  const valueToInsert = `${symbol}_CONTRACT=${address}`;
  const replacedEnvContent = existingEnvContent.replace(
    reToReplace,
    valueToInsert
  );

  fs.unlinkSync(envFilePath);
  fs.writeFileSync(envFilePath, replacedEnvContent);
};

module.exports = {
  replaceAddressInWeb,
  replaceAddressInApi,
};
