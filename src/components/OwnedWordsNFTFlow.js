import {
  Center,
  useColorMode,
  Text,
  VStack,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useCallback, useEffect, useState } from "react";
import TwitterLogin from "react-twitter-login";

import ConnectWeb3Button, {
  getSweetAddressRepresentation,
} from "../containers/ConnectWeb3Button";
import ListOfTweets from "../containers/ListOfTweets";
import Mint from "./Mint";

const StepWrapper = ({ children }) => <Center p="6">{children}</Center>;

const OwnedWordsNFTFlow = ({ addMintedToken }) => {
  const { account } = useEthers();
  const ens = useLookupAddress();
  const { colorMode } = useColorMode();
  const { setStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const [connectedSocialNetwork, setConnectedSocialNetwork] = useState();
  const [twitterAuthData, setTwitterAuthData] = useState();

  const [ownedWords, setOwnedWords] = useState();
  const [tokenId, setTokenId] = useState();

  const getSNName = useCallback(() => {
    switch (connectedSocialNetwork) {
      case "twitter": {
        return ` as ${twitterAuthData.screen_name}`;
      }
      default:
        return "";
    }
  }, [connectedSocialNetwork, twitterAuthData]);

  useEffect(() => {
    let initialStep = 0;
    if (account) {
      initialStep += 1;
    }

    if (connectedSocialNetwork) {
      initialStep += 1;
    }

    if (ownedWords) {
      initialStep += 1;
    }

    if (tokenId) {
      initialStep += 1;
    }

    setStep(initialStep);
  }, [account, connectedSocialNetwork, ownedWords, setStep, tokenId]);

  const twitterAuthHandler = useCallback(
    (err, data) => {
      if (data) {
        setTwitterAuthData(data);
        setConnectedSocialNetwork("twitter");
      }
    },
    [setTwitterAuthData]
  );

  const handleWordsSelection = useCallback(
    (data) => {
      setOwnedWords(data);
    },
    [setOwnedWords]
  );

  const onMintSucceeded = useCallback(
    (tokenId) => {
      setTokenId(tokenId);
      addMintedToken(tokenId);
    },
    [addMintedToken]
  );

  const onMintFailure = useCallback(() => {
    setOwnedWords(undefined);
  }, [setOwnedWords]);

  const backToSNSelector = useCallback(() => {
    setConnectedSocialNetwork(undefined);
    setTwitterAuthData(undefined);
  }, [setConnectedSocialNetwork, setTwitterAuthData]);

  const resetToStart = useCallback(() => {
    setTokenId(undefined);
    setOwnedWords(undefined);
    setConnectedSocialNetwork(undefined);
    setTwitterAuthData(undefined);
  }, [
    setTokenId,
    setOwnedWords,
    setConnectedSocialNetwork,
    setTwitterAuthData,
  ]);

  return (
    <Steps activeStep={activeStep} orientation="vertical">
      <Step
        label={
          !account
            ? "Connect to Etherium network"
            : ens ?? getSweetAddressRepresentation(account)
        }
      >
        <StepWrapper>
          <ConnectWeb3Button size="lg" />
        </StepWrapper>
      </Step>
      <Step
        label={
          !connectedSocialNetwork
            ? "Connect a social account"
            : `Connected to ${connectedSocialNetwork}${getSNName()}`
        }
      >
        <StepWrapper>
          {twitterAuthData ? (
            <Text>You are connected to Twitter!</Text>
          ) : (
            <TwitterLogin
              authCallback={twitterAuthHandler}
              consumerKey={process.env.REACT_APP_TWITTER_API_KEY}
              consumerSecret={process.env.REACT_APP_TWITTER_API_SECRET}
              buttonTheme={colorMode}
            />
          )}
        </StepWrapper>
      </Step>
      <Step label={!ownedWords ? "Select your words" : "Almost there!"}>
        <StepWrapper>
          {connectedSocialNetwork === "twitter" && (
            <ListOfTweets
              auth={twitterAuthData}
              goToPrevStep={backToSNSelector}
              onSelect={handleWordsSelection}
            />
          )}
        </StepWrapper>
      </Step>
      <Step label="Mint your OwnedWords NFT">
        <StepWrapper>
          <Mint
            oww={ownedWords}
            onSuccess={onMintSucceeded}
            onFailure={onMintFailure}
          />
        </StepWrapper>
      </Step>
      <Step label="Final step">
        <StepWrapper>
          <VStack>
            <Heading size="2xlg">🚀 Congratulations!</Heading>
            <Text paddingBottom="6">
              You are now a happy owner of the OWW #{tokenId} NFT!
            </Text>
            <Button onClick={resetToStart} size="lg" colorScheme="green">
              Mint another one
            </Button>
          </VStack>
        </StepWrapper>
      </Step>
    </Steps>
  );
};

export default OwnedWordsNFTFlow;
