import {
  Button,
  Box,
  Text,
  useColorMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Identicon from '../components/Identicon'
import web3Selector from '../redux/selectors/web3'
import { connect as connectAction } from '../redux/actions/web3'
import { WebRoutes } from '../WebRoutes'
import { Link } from 'react-router-dom'

const ConnectWeb3Button: React.FC = () => {
  const { colorMode } = useColorMode()
  const { address, sweetAddress, loading } = useSelector(web3Selector)
  const dispatch = useDispatch()

  const connect = useCallback(() => {
    dispatch(connectAction())
  }, [dispatch])

  return address ? (
    <Menu>
      <MenuButton
        as={Button}
        bg={colorMode === 'dark' ? 'gray.800' : undefined}
        border="1px solid transparent"
        _hover={{
          border: '1px',
          borderStyle: 'solid',
          borderColor: colorMode === 'dark' ? 'blue.400' : 'blue.500',
          backgroundColor: colorMode === 'dark' ? 'gray.700' : 'gray.200',
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Box
          display="flex"
          alignItems="center"
          background={colorMode === 'dark' ? 'gray.700' : undefined}
          borderRadius="xl"
          py="0"
        >
          <Text fontSize="md" fontWeight="medium" mr="2">
            {sweetAddress}
          </Text>
          <Identicon address={address} />
        </Box>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to={WebRoutes.activity}>
          Activity
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button onClick={connect} isLoading={loading}>
      Connect
    </Button>
  )
}

export default ConnectWeb3Button
