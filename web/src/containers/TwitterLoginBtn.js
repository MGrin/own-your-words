import React, { useState, useCallback, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { getAccessToken, getAuthLink } from "../utils/twitter";

const TwitterLoginBtn = ({ onSuccess }) => {
  const { twitter, setTwitterAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const initLoginFlow = useCallback(() => {
    setLoading(true);
    setError(undefined);
    const callbackUrl = `${window.location.origin}${window.location.pathname}#twitter`;

    getAuthLink(callbackUrl)
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
          console.log(accessToken);
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
