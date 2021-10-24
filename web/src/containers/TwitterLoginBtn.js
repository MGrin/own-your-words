import React, { useState, useCallback, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";

import { getAccessToken, getAuthLink } from "../utils/twitter";

const TwitterLoginBtn = ({
  mode,
  loading: passedLoading,
  label,
  disabled,
  onClick,
}) => {
  const { twitter, setTwitterAccessToken } = useAuth();
  const [loading, setLoading] = useState(passedLoading || false);
  const [error, setError] = useState();

  useEffect(() => {
    if (loading !== passedLoading) {
      setLoading(passedLoading);
    }
  }, [passedLoading]);
  const initLoginFlow = useCallback(() => {
    if (onClick) {
      onClick();
    }
    setLoading(true);
    setError(undefined);
    const callbackUrl = `${window.location.origin}${window.location.pathname}#twitter`;

    getAuthLink(callbackUrl)
      .then((authLink) => {
        window.location.href = authLink;
      })
      .catch((err) => setError(err));
  }, [onClick, setLoading, setError]);

  useEffect(() => {
    if (twitter && twitter.requestTokenData && !twitter.accessToken) {
      setLoading(true);
      if (mode === "mint") {
        return;
      }
      getAccessToken(twitter.requestTokenData)
        .then((accessToken) => {
          setTwitterAccessToken(accessToken);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [twitter, setTwitterAccessToken, mode]);

  return (
    <>
      <Button
        isLoading={loading}
        size="lg"
        colorScheme="twitter"
        disabled={loading || disabled}
        onClick={initLoginFlow}
      >
        {label || "Twitter"}
      </Button>
      {error && <Text variant="error">{error.message}</Text>}
    </>
  );
};

export default TwitterLoginBtn;
