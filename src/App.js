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
import { useCallback, useEffect, useRef, useState } from "react";
import { useEthers } from "@usedapp/core";
import Web3 from "web3";

import abi from "./abi.json";
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
  const { library, account } = useEthers();
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const contract = useRef();
  const web3 = useRef();

  useEffect(() => {
    setError(undefined);
  }, []);
  const addMintedToken = useCallback(
    (tokenId) => {
      if (!account || !web3.current || !contract.current) {
        return;
      }

      setLoading(true);
      setError(undefined);
      transformTokenIDToOWW(tokenId, account, contract.current)
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
    [account, tokens, setTokens, setError, setLoading]
  );

  useEffect(() => {
    if (!account) {
      return;
    }
    setLoading(true);

    web3.current = new Web3(library.provider);
    contract.current = new web3.current.eth.Contract(
      abi.abi,
      process.env.REACT_APP_OWW_CONTRACT
    );

    fetchOwnedTokens(account, contract.current)
      .then((owws) => {
        setTokens(owws);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        console.log(error);
      });
  }, [account, library]);

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
          <Tabs>
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
