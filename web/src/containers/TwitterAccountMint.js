import { Box, Flex, Image, Spacer, Button } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TwitterLoginBtn from "./TwitterLoginBtn";
import { useAuth } from "../hooks/useAuth";
import { useOWSN, useTM } from "../hooks/useOwnedWords";
import { useWeb3 } from "../hooks/useWeb3";

const TwitterAccountMint = () => {
  const [mode, setModeState] = useState(
    localStorage.getItem("twitter_minting_mode") || "check"
  );
  const setMode = useCallback((m) => {
    localStorage.setItem("twitter_minting_mode", m);
    setModeState(m);
  }, []);
  const [price, setPrice] = useState();
  const [redirectedFromTwitter, setRedirectedFromTwitter] = useState(true);
  const [isAccountMinted, setIsAccountMinted] = useState();

  const { library } = useWeb3();
  const { twitter, clearTwitterAuthData } = useAuth();
  const { owsn, getOwnedAccountByGenSnId, mintTwitter } = useOWSN();
  const { tm, getMintPrice, subscribeToEvents } = useTM();

  const tmSubscriptions = useRef();

  useEffect(() => {
    if (tmSubscriptions.current) {
      Object.keys(tmSubscriptions.current).forEach((subscription) =>
        subscription.unsubscrive()
      );
    }
  }, []);

  useEffect(() => {
    if (!library || !tm) {
      return;
    }

    getMintPrice()
      .then((res) => {
        setPrice(library.utils.fromWei(res));
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [library, tm, getMintPrice]);

  const checkAvailability = useCallback(() => {
    if (!twitter || !twitter.accessToken) {
      return;
    }

    getOwnedAccountByGenSnId(`twitter_${twitter.accessToken.user_id}`)
      .then((resp) => {
        setIsAccountMinted(true);
      })
      .catch((err) => {
        setIsAccountMinted(false);
      })
      .finally(() => {
        clearTwitterAuthData();
      });
  }, [getOwnedAccountByGenSnId, clearTwitterAuthData, twitter]);

  const mintTwitterToken = useCallback(() => {
    if (
      !tm ||
      !twitter ||
      !twitter.requestTokenData ||
      !redirectedFromTwitter
    ) {
      return;
    }

    if (twitter.accessToken) {
      console.error("Request token was already used!");
    }

    setRedirectedFromTwitter(false);
    tmSubscriptions.current = subscribeToEvents(
      console.log,
      console.log,
      console.log,
      console.error
    );

    mintTwitter(
      twitter.requestTokenData.oauthToken,
      twitter.requestTokenData.oauthVerifier
    )
      .then((resp) => {
        console.log(resp);
        // TODO
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        clearTwitterAuthData();
      });
  }, [
    mintTwitter,
    subscribeToEvents,
    clearTwitterAuthData,
    redirectedFromTwitter,
    twitter,
    tm,
  ]);

  useEffect(() => {
    if (!owsn) {
      return;
    }

    if (mode === "check") {
      checkAvailability();
    }

    if (mode === "mint") {
      mintTwitterToken();
    }
  }, [owsn, mode, checkAvailability, mintTwitterToken]);

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p={6}>
        <Box display="flex" alignItems="center">
          <Image
            src="https://cdn.cms-twdigitalassets.com/content/dam/developer-twitter/images/Twitter_logo_blue_48.png"
            alt="Twitter logo"
          />
          <Box
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xl"
            textTransform="uppercase"
            ml="2"
          >
            {price} ETH
          </Box>
        </Box>
      </Box>
      <Flex p={6}>
        {isAccountMinted === undefined ? (
          <TwitterLoginBtn
            mode="check"
            label="Check availability"
            onClick={() => {
              setMode("check");
            }}
          />
        ) : (
          <Button size="lg" colorScheme={isAccountMinted ? "red" : "green"}>
            {isAccountMinted
              ? "Account already minted by someone else!"
              : "Account is free to mint!"}
          </Button>
        )}

        <Spacer />
        <TwitterLoginBtn
          mode="mint"
          label="Mint"
          disabled={isAccountMinted}
          onClick={() => {
            setMode("mint");
          }}
        />
      </Flex>
    </Box>
  );
};

export default TwitterAccountMint;
