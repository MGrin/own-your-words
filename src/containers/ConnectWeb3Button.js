import { Button, Box, Text, useColorMode } from "@chakra-ui/react";
import { useEthers, useEtherBalance, useLookupAddress } from "@usedapp/core";
import { useCallback } from "react";
import { formatEther } from "@ethersproject/units";
import Identicon from "../components/Identicon";

export const getSweetAddressRepresentation = (account) =>
  account
    ? `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
      )}`
    : "";

const ConnectWeb3Button = ({ size }) => {
  const { activateBrowserWallet, account } = useEthers();
  const ens = useLookupAddress();
  const etherBalance = useEtherBalance(account);
  const { colorMode } = useColorMode();

  const connect = useCallback(() => {
    activateBrowserWallet((error) => {
      console.log(error);
    });
  }, [activateBrowserWallet]);

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background={colorMode === "dark" ? "gray.700" : undefined}
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text fontSize="md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        bg={colorMode === "dark" ? "gray.800" : undefined}
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: colorMode === "dark" ? "blue.400" : "blue.500",
          backgroundColor: colorMode === "dark" ? "gray.700" : "gray.200",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text fontSize="md" fontWeight="medium" mr="2">
          {account && (ens ?? getSweetAddressRepresentation(account))}
        </Text>
        <Identicon />
      </Button>
    </Box>
  ) : (
    <Button size={size} onClick={connect}>
      Connect
    </Button>
  );
};

export default ConnectWeb3Button;
