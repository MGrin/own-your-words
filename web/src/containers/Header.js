import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Flex,
  Spacer,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  HStack,
  Stack,
  Image,
  IconButton,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ConnectWeb3Button from "./ConnectWeb3Button";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useHistory } from "react-router-dom";
import { useWeb3, CHAINS } from "../hooks/useWeb3";
import { ENV } from "../utils/constants";

const Header = () => {
  const { connected, library } = useWeb3();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [network, setNetwork] = useState();

  const drawerButtonRef = useRef();
  const isMobile = useBreakpointValue([true, false]);
  const history = useHistory();

  useEffect(() => {
    if (!library) {
      return;
    }

    setNetwork(CHAINS[library.givenProvider.networkVersion]);
  }, [library]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  const goToLanding = useCallback(() => {
    history.push("/");
  }, [history]);
  const goToAccounts = useCallback(() => {
    history.push("/accounts");
  }, [history]);
  const goToWords = useCallback(() => {
    history.push("/words");
  }, [history]);
  const goToStatements = useCallback(() => {
    history.push("/statements");
  }, [history]);

  const navigationList = (
    <>
      {!isMobile && (
        <IconButton
          aria-label="Own your words"
          onClick={goToLanding}
          icon={
            <Image
              src={process.env.PUBLIC_URL + "/logo.jpg"}
              width="40px"
              borderRadius="base"
            />
          }
        />
      )}
      <Button variant="ghost" onClick={goToAccounts}>
        Accounts
      </Button>
      <Button variant="ghost" onClick={goToWords}>
        Words
      </Button>
      <Button variant="ghost" onClick={goToStatements}>
        Statements
      </Button>
    </>
  );

  return (
    <Flex paddingBottom={["12", "6"]}>
      {isMobile && <ConnectWeb3Button />}
      {connected && !isMobile && <HStack>{navigationList}</HStack>}
      <Spacer />
      {!isMobile && (
        <HStack>
          {ENV !== "production" && library && <Text>{network}</Text>}
          <ThemeSwitcher />
          <ConnectWeb3Button />
        </HStack>
      )}
      {isMobile && (
        <>
          <Button
            ref={drawerButtonRef}
            onClick={openDrawer}
            rightIcon={<HamburgerIcon />}
          >
            Menu
          </Button>
          <Drawer
            isOpen={isDrawerOpen}
            placement="right"
            onClose={closeDrawer}
            finalFocusRef={drawerButtonRef}
          >
            <DrawerOverlay />
            <DrawerContent p="3">
              <DrawerCloseButton />
              <DrawerHeader mt="6" p="3">
                <Flex>
                  <Button variant="ghost" onClick={goToLanding}>
                    OWW
                  </Button>
                  <Spacer />
                  <ThemeSwitcher />
                </Flex>
              </DrawerHeader>
              <DrawerBody>
                <Stack>{navigationList}</Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default Header;
