import {
  Box,
  Flex,
  Image,
  Switch,
  Button,
  Text,
  Spacer,
} from "@chakra-ui/react";
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
  const [minting, setMinting] = useState(false);

  const { library } = useWeb3();
  const { twitter, clearTwitterAuthData } = useAuth();
  const { owsn, getOwnedAccountByGenSnId, mintTwitter } = useOWSN();
  const { tm, getMintPrice, subscribeToEvents } = useTM();

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

  const handleTMEvent = useCallback(
    (event) => (data) => {
      console.log(event, data.returnValues);
      if (event !== "TwitterAuthRequestSubmited") {
        setMinting(false);
      }
    },
    []
  );

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
    subscribeToEvents({
      onRequestSubmitted: handleTMEvent("TwitterAuthRequestSubmited"),
      onRequestSucceeded: handleTMEvent("TwitterAuthRequestSucceeded"),
      onRequestFailed: handleTMEvent("TwitterAuthRequestFailed"),
      onError: console.error,
    });

    setMinting(true);
    mintTwitter(
      twitter.requestTokenData.oauthToken,
      twitter.requestTokenData.oauthVerifier
    )
      .then((tx) => {
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
      <Flex p={6} justifyContent="center" alignItems="center">
        <Text>Check availability</Text>
        <Spacer />
        <Switch
          p="1"
          size="lg"
          isChecked={mode === "mint"}
          onChange={(e) =>
            isAccountMinted
              ? null
              : setMode(e.target.checked ? "mint" : "check")
          }
        />
        <Spacer />
        <Text>Mint</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" p={6}>
        {mode === "check" && (
          <>
            {isAccountMinted === undefined ? (
              <TwitterLoginBtn mode="check" label="Check availability" />
            ) : (
              <Button size="lg" colorScheme={isAccountMinted ? "red" : "green"}>
                {isAccountMinted
                  ? "Account already minted!"
                  : "Account is free to mint!"}
              </Button>
            )}
          </>
        )}
        {mode === "mint" && (
          <TwitterLoginBtn
            mode="mint"
            label="Mint"
            disabled={isAccountMinted}
            loading={minting}
          />
        )}
      </Flex>
    </Box>
  );
};

export default TwitterAccountMint;
