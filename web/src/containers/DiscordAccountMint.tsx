import { Box, Flex, Image, Button, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MODE } from '../services/TwitterAuthService'
import { getDiscordPrice } from '../redux/actions/owsn'
import { owsnDiscordSelector } from '../redux/selectors/owsn'
import discordAuthSelector from '../redux/selectors/discordAuth'
import { formatError } from '../utils'
import { fetchRequestToken } from '../redux/actions/discordAuth'

const DiscordAccountMint = () => {
  const dispatch = useDispatch()

  const { loading: authLoading, error: authError } =
    useSelector(discordAuthSelector)

  const {
    price,
    loading: owsnLoading,
    error: owsnError,
    available: owsnAvailable,
  } = useSelector(owsnDiscordSelector)

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
    dispatch(getDiscordPrice())
  }, [dispatch])

  const onClick = useCallback(() => {
    const callbackUrl =
      mode === MODE.mint
        ? `${window.location.href}/discord`
        : `${window.location.href}/discord/check`
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
            w="48px"
            h="48px"
            src={`${process.env.PUBLIC_URL}/discord-logo.png`}
            alt="Discord logo"
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

export default DiscordAccountMint
