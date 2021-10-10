import {
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useEthers } from "@usedapp/core";

import ConnectWeb3Button from "../containers/ConnectWeb3Button";
import OWW from "./OWW";

const OwnedWordsList = ({ tokens, error, loading }) => {
  const { account } = useEthers();

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error occured!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please reload the page, maybe things will get better, who knows...
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  if (!account) {
    return (
      <Center>
        <ConnectWeb3Button />
      </Center>
    );
  }

  if (!tokens.length) {
    return (
      <Center>
        <Text>
          You do not own any OOW tokens yet, feel free to mint themselves for
          you!
        </Text>
      </Center>
    );
  }

  return (
    <>
      {tokens.map((token) => (
        <OWW key={token.tokenId} {...token} />
      ))}
    </>
  );
};

export default OwnedWordsList;
