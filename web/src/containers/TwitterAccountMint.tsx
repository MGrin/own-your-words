import {
  Box,
  Flex,
  Image,
  Switch,
  Button,
  Text,
  Spacer,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import twitterAuthService, { MODE } from "../services/TwitterAuthService";
import twitterAuthSelector from "../redux/selectors/twitterAuth";
import { fetchRequestToken } from "../redux/actions/twitterAuth";
import { getTwitterPrice } from "../redux/actions/owsn";
import { owsnTwitterSelector } from "../redux/selectors/owsn";

const TwitterAccountMint = () => {
  const [mode, setMode] = useState<MODE>(twitterAuthService.mode || MODE.check);
  const dispatch = useDispatch();

  const { loading: authLoading, error: authError } =
    useSelector(twitterAuthSelector);

  const {
    price,
    loading: owsnLoading,
    error: owsnError,
    available: owsnAvailable,
  } = useSelector(owsnTwitterSelector);

  const loading = authLoading || owsnLoading;

  const error = authError || owsnError;

  useEffect(() => {
    dispatch(getTwitterPrice());
  }, [dispatch]);

  const onClick = useCallback(() => {
    dispatch(
      fetchRequestToken({
        callbackUrl: `${window.location.href}#twitter-${mode}`,
      })
    );
  }, [dispatch, mode]);

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
          isChecked={mode === MODE.mint}
          onChange={(e) =>
            owsnAvailable
              ? setMode(e.target.checked ? MODE.mint : MODE.check)
              : undefined
          }
        />
        <Spacer />
        <Text>Mint</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" p={6}>
        {owsnAvailable ? (
          error ? (
            <Text>Error: {error.message}</Text>
          ) : (
            <Button
              size="lg"
              colorScheme="twitter"
              onClick={onClick}
              isLoading={loading}
            >
              {mode === MODE.check ? "Check availability" : "Mint"}
            </Button>
          )
        ) : (
          <Text>Account is not available</Text>
        )}
      </Flex>
    </Box>
  );
};

export default TwitterAccountMint;
