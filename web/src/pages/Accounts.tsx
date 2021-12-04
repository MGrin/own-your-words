import { PlusSquareIcon } from '@chakra-ui/icons'
import { Stack, Button, Flex, Box } from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import OWSNPreview from '../components/OWSNPreview'
import { getTokenIds } from '../redux/actions/owsn'
import { tokenIdsSelector } from '../redux/selectors/owsn'
import { WebRoutes } from '../WebRoutes'

const Accounts = () => {
  const tokenIds = useSelector(tokenIdsSelector)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTokenIds())
  }, [dispatch])

  const onMintOWSNClick = useCallback(() => {
    history.push(WebRoutes.accountMint)
  }, [history])

  return (
    <Stack>
      <Button
        colorScheme="teal"
        leftIcon={<PlusSquareIcon />}
        maxW="xs"
        onClick={onMintOWSNClick}
      >
        Mint OWSN NFT
      </Button>
      <Flex wrap="wrap" pt={12}>
        {tokenIds.map((tokenId) => (
          <Box m={4} key={tokenId}>
            <OWSNPreview tokenId={tokenId} />
          </Box>
        ))}
      </Flex>
    </Stack>
  )
}

export default Accounts
