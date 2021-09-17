import {
  Heading,
  Text,
  Box,
  Container,
  Center,
  Flex,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { useOWW } from "./hooks/useOwnedWords";

import ConnectWeb3Button from "./components/ConnectWeb3Button";
import ThemeSwitcher from "./components/ThemeSwitcher";
import OwnedWordsNFTFlow from "./components/OwnedWordsNFTFlow";
import OwnedWordsList from "./components/OwnedWordsList";

const transformTokenIDToOWW = async (tokenId, account, contract) => {
  const promises = [
    contract.methods.tokenURI(tokenId).call({ sender: account }),
    contract.methods.get_post_url(tokenId).call({ sender: account }),
  ];

  const data = await Promise.all(promises);

  return {
    tokenId,
    metadataURI: data[0],
    postURL: data[1],
  };
};

const fetchOwnedTokens = async (account, contract) => {
  const tokenIds = await contract.methods.get_tokens().call({ from: account });
  const owwPromises = tokenIds.map((tokenId) =>
    transformTokenIDToOWW(tokenId, account, contract)
  );
  const owws = await Promise.all(owwPromises);
  return owws;
};

const App = () => {
  const contract = useOWW();
  const { account } = useEthers();
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const addMintedToken = useCallback(
    (tokenId) => {
      if (!account || !contract) {
        return;
      }

      setLoading(true);
      setError(undefined);
      transformTokenIDToOWW(tokenId, account, contract)
        .then((oww) => {
          setTokens([...tokens, oww]);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
          console.log(error);
        });
    },
    [account, tokens, contract, setTokens, setError, setLoading]
  );

  useEffect(() => {
    if (!account || !contract) {
      return;
    }
    contract.methods
      .get_version()
      .call()
      .then((r) => console.log(r))
      .catch((err) => console.log(err));
    setLoading(true);

    fetchOwnedTokens(account, contract)
      .then((owws) => {
        setTokens(owws);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        console.log(error);
      });
  }, [account, contract]);

  return (
    <Box p="6">
      <Flex paddingBottom={["12", "6"]}>
        <ConnectWeb3Button />
        <Spacer />
        <ThemeSwitcher />
      </Flex>
      <Box paddingBottom={["12", "6"]}>
        <Center>
          <Heading as="h1" size="3xl">
            Own your words.
          </Heading>
        </Center>
      </Box>
      <Center>
        <Text boxShadow="lg" p="6" fontWeight="semibold">
          Store your social media posts on a blockchain. <br /> Own them as
          NFTs.
        </Text>
      </Center>
      <Center>
        <Container
          maxW="3xl"
          centerContent
          m={["0", "6"]}
          p="12"
          boxShadow="lg"
          border="1px"
          borderColor="gray.300"
          borderRadius="6"
        >
          <Tabs width="100%">
            <TabList>
              <Tab>Mint your OWW</Tab>
              <Tab>See your OWW tokens ({tokens.length})</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <OwnedWordsNFTFlow addMintedToken={addMintedToken} />
              </TabPanel>
              <TabPanel>
                <OwnedWordsList
                  tokens={tokens}
                  error={error}
                  loading={loading}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Center>
    </Box>
  );
};

export default App;
