import { Stack, Text, Flex } from "@chakra-ui/react";
import React from "react";
import TwitterLoginBtn from "../containers/TwitterLoginBtn";
import { useAuth } from "../hooks/useAuth";

const Accounts = () => {
  const { twitter } = useAuth();

  return (
    <Stack>
      <Flex>
        <TwitterLoginBtn />
        {twitter && twitter.accessToken && <Text>Connected</Text>}
      </Flex>
    </Stack>
  );
};

export default Accounts;
