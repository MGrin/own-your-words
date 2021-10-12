import { Button, Box, Text, useColorMode } from "@chakra-ui/react";
import Identicon from "../components/Identicon";
import { useWeb3 } from "../hooks/useWeb3";

const ConnectWeb3Button = ({ size }) => {
  const { colorMode } = useColorMode();
  const { sweetAccount, account, connect } = useWeb3();

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background={colorMode === "dark" ? "gray.700" : undefined}
      borderRadius="xl"
      py="0"
    >
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
          {sweetAccount}
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
