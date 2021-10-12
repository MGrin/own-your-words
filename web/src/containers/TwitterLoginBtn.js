import React, { useState, useCallback, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { HmacSHA1, enc } from "crypto-js";
import { useAuth } from "../hooks/useAuth";

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

  const signingKey = `${encodeURIComponent(
    process.env.REACT_APP_TWITTER_API_SECRET
  )}&`;

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
    oauth_consumer_key: process.env.REACT_APP_TWITTER_API_KEY,
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    oauth_callback: callbackUrl,
    oauth_timestamp: (Date.now() / 1000).toFixed(),
    oauth_nonce: uuid(),
  };

  return makeSignature(params, method, apiUrl);
};

export const accessTokenSignature = ({
  oauthToken,
  oauthVerifier,
  method,
  apiUrl,
}) => {
  const params = {
    oauth_consumer_key: process.env.REACT_APP_TWITTER_API_KEY,
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    oauth_timestamp: (Date.now() / 1000).toFixed(),
    oauth_nonce: Math.random()
      .toString(36)
      .replace(/[^a-z]/, "")
      .substr(2),
  };

  return makeSignature(params, method, apiUrl);
};

const parseOAuthRequestToken = (responseText) =>
  responseText.split("&").reduce((prev, el) => {
    const [key, value] = el.split("=");
    return { ...prev, [key]: value };
  }, {});

export const getAccessToken = async ({ oauthToken, oauthVerifier }) => {
  const method = "POST";
  const apiUrl = "https://api.twitter.com/oauth/access_token";

  const oauthSignature = accessTokenSignature({
    method,
    apiUrl,
    oauthToken,
    oauthVerifier,
  });
  const res = await fetch(`https://cors.bridged.cc/${apiUrl}`, {
    method,
    headers: {
      Authorization: `OAuth ${oauthSignature}`,
    },
  });
  const responseText = await res.text();
  return parseOAuthRequestToken(responseText);
};

const getAuthLink = async (callbackUrl) => {
  const apiUrl = "https://api.twitter.com/oauth/request_token";
  const oauthSignature = requestTokenSignature({
    method: "POST",
    apiUrl,
    callbackUrl,
  });
  const res = await fetch(`https://cors.bridged.cc/${apiUrl}`, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${oauthSignature}`,
    },
  });
  const responseText = await res.text();
  const requestTokenData = parseOAuthRequestToken(responseText);
  if (requestTokenData.oauth_callback_confirmed !== "true") {
    throw new Error("Callback url is not confirmed");
  }

  return `https://api.twitter.com/oauth/authorize?oauth_token=${requestTokenData.oauth_token}`;
};

const TwitterLoginBtn = ({ onSuccess }) => {
  const { twitter, setTwitterAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const initLoginFlow = useCallback(() => {
    setLoading(true);
    setError(undefined);
    getAuthLink(`${window.location.origin}${window.location.pathname}#twitter`)
      .then((authLink) => {
        window.location.href = authLink;
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [setLoading, setError]);

  useEffect(() => {
    if (twitter && twitter.requestTokenData && !twitter.accessToken) {
      if (onSuccess) {
        return onSuccess(twitter.requestTokenData);
      }
      setLoading(true);
      getAccessToken(twitter.requestTokenData)
        .then((accessToken) => {
          setTwitterAccessToken(accessToken);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [twitter, setTwitterAccessToken]);

  return (
    <>
      <Button
        isLoading={loading}
        size="lg"
        colorScheme="twitter"
        onClick={initLoginFlow}
      >
        Twitter
      </Button>
      {error && <Text variant="error">{error.message}</Text>}
    </>
  );
};

export default TwitterLoginBtn;
