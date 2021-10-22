const { HmacSHA1, enc } = require("crypto-js");
const { v4: uuid } = require("uuid");
const axios = require("axios");
const { TWITTER_API_KEY, TWITTER_API_SECRET } = require("../constants");

const parseOAuthRequestToken = (responseText) =>
  responseText.split("&").reduce((prev, el) => {
    const [key, value] = el.split("=");
    return { ...prev, [key]: value };
  }, {});

const makeSignature = (params, method, apiUrl) => {
  const paramsBaseString = Object.keys(params)
    .sort()
    .reduce((prev, el) => {
      return (prev += `&${el}=${params[el]}`);
    }, "")
    .substr(1);

  const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(
    apiUrl
  )}&${encodeURIComponent(paramsBaseString)}`;

  const signingKey = `${encodeURIComponent(TWITTER_API_SECRET)}&`;

  const oauth_signature = enc.Base64.stringify(
    HmacSHA1(signatureBaseString, signingKey)
  );

  const paramsWithSignature = {
    ...params,
    oauth_signature: encodeURIComponent(oauth_signature),
  };

  return Object.keys(paramsWithSignature)
    .sort()
    .reduce((prev, el) => {
      return (prev += `,${el}="${paramsWithSignature[el]}"`);
    }, "")
    .substr(1);
};

const requestTokenSignature = ({ method, apiUrl, callbackUrl }) => {
  const params = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    oauth_callback: encodeURIComponent(callbackUrl),
    oauth_timestamp: (Date.now() / 1000).toFixed(),
    oauth_nonce: uuid(),
  };

  return makeSignature(params, method, apiUrl);
};

const accessTokenSignature = ({
  oauthToken,
  oauthVerifier,
  method,
  apiUrl,
}) => {
  const params = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    oauth_timestamp: (Date.now() / 1000).toFixed(),
    oauth_nonce: uuid(),
  };

  return makeSignature(params, method, apiUrl);
};

const getAuthLink = async (callbackUrl) => {
  const method = "POST";
  const apiUrl = "https://api.twitter.com/oauth/request_token";
  const oauthSignature = requestTokenSignature({
    method,
    apiUrl,
    callbackUrl,
  });
  try {
    const res = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `OAuth ${oauthSignature}`,
        accept: "*/*",
      },
    });

    const responseText = res.data;
    const requestTokenData = parseOAuthRequestToken(responseText);
    if (requestTokenData.oauth_callback_confirmed !== "true") {
      throw new Error("Callback url is not confirmed");
    }

    return `https://api.twitter.com/oauth/authorize?oauth_token=${requestTokenData.oauth_token}`;
  } catch (err) {
    const msg = err.toJSON().message;
    console.error(msg);
    throw new Error(msg);
  }
};

const getAccessToken = async ({ oauthToken, oauthVerifier }) => {
  const method = "POST";
  const apiUrl = "https://api.twitter.com/oauth/access_token";

  const oauthSignature = accessTokenSignature({
    method,
    apiUrl,
    oauthToken,
    oauthVerifier,
  });

  console.log(oauthSignature);
  try {
    const res = await axios({
      url: apiUrl,
      method,
      headers: {
        Authorization: `OAuth ${oauthSignature}`,
        accept: "*/*",
      },
    });
    const responseText = res.data;
    return parseOAuthRequestToken(responseText);
  } catch (err) {
    const msg = err.toJSON().message;
    console.error(msg);
    throw new Error(msg);
  }
};

module.exports = {
  getAuthLink,
  getAccessToken,
};
