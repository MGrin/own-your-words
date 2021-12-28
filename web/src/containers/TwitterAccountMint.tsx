import { Box, Flex, Image, Button, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MODE } from '../services/TwitterAuthService'
import twitterAuthSelector from '../redux/selectors/twitterAuth'
import { fetchRequestToken } from '../redux/actions/twitterAuth'
import { getTwitterPrice } from '../redux/actions/owsn'
import { owsnTwitterSelector } from '../redux/selectors/owsn'
import { formatError } from '../utils'

const TwitterAccountMint = () => {
  const dispatch = useDispatch()

  const { loading: authLoading, error: authError } =
    useSelector(twitterAuthSelector)

  const {
    price,
    loading: owsnLoading,
    error: owsnError,
    available: owsnAvailable,
  } = useSelector(owsnTwitterSelector)

  const [mode, setMode] = useState<MODE>(
    owsnAvailable === true ? MODE.mint : MODE.check
  )

  useEffect(() => {
    if (owsnAvailable) {
      setMode(MODE.mint)
    }
  }, [owsnAvailable])

  const loading = authLoading || owsnLoading

  const error = authError || owsnError

  useEffect(() => {
    dispatch(getTwitterPrice())
  }, [dispatch])

  const onClick = useCallback(() => {
    const callbackUrl =
      mode === MODE.mint
        ? `${window.location.href}/twitter`
        : `${window.location.href}/twitter/check`
    dispatch(
      fetchRequestToken({
        callbackUrl,
      })
    )
  }, [dispatch, mode])

  let btn
  if (owsnAvailable !== false) {
    btn = (
      <Button
        size="lg"
        colorScheme="twitter"
        disabled={loading}
        onClick={onClick}
        isLoading={loading}
      >
        {mode === MODE.check ? 'Check availability' : 'Mint'}
      </Button>
    )
  } else {
    btn = <Text>Account is not available</Text>
  }

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
      <Flex alignItems="center" justifyContent="center" p={6}>
        {btn}
      </Flex>
      {error && <Text color="tomato">{formatError(error)}</Text>}
    </Box>
  )
}

export default TwitterAccountMint
