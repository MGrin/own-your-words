import {
  Box,
  Container,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './containers/Header'
import ProtectedRoute from './containers/ProtectedRoute'
import Accounts from './pages/Accounts'
import Landing from './pages/Landing'
import Statements from './pages/Statements'
import Words from './pages/Words'
import ethersService from './services/EthersService'
import { WebRoutes } from './WebRoutes'
import { changeLoading, connect } from './redux/actions/web3'
import web3Selector from './redux/selectors/web3'
import AccountMint from './pages/AccountMint'
import Activity from './pages/Activity'
import { uiSelector } from './redux/selectors/ui'

const App = () => {
  const { loading } = useSelector(web3Selector)
  const { networkNotSupportedBannerVisible } = useSelector(uiSelector)
  const { network } = useSelector(web3Selector)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const dispatch = useDispatch()

  useEffect(() => {
    if (!ethersService.autoConnect) {
      dispatch(changeLoading({ loading: false }))
      return
    }

    dispatch(connect())
  }, [dispatch])

  useEffect(() => {
    if (networkNotSupportedBannerVisible && !isOpen) {
      return onOpen()
    }

    if (!networkNotSupportedBannerVisible && isOpen) {
      return onClose()
    }
  }, [networkNotSupportedBannerVisible, isOpen, onOpen, onClose])

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {network?.name || 'Network'} is not supported
          </ModalHeader>
          <ModalBody pb={6}>
            <Text>
              {network?.name || 'Network'} is not yet supported. Sorry for
              inconvenience.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box p="6">
        <Header />
        <Container maxW="container.lg">
          {!loading && (
            <Switch>
              <Route path={WebRoutes.root} exact component={Landing} />
              <ProtectedRoute
                path={WebRoutes.accountMint}
                exact
                component={AccountMint}
              />
              <ProtectedRoute
                path={WebRoutes.accountMintTwitter}
                exact
                component={AccountMint}
              />
              <ProtectedRoute
                path={WebRoutes.accountMintTwitterCheck}
                exact
                component={AccountMint}
              />
              <ProtectedRoute
                path={WebRoutes.accountMintDiscord}
                exact
                component={AccountMint}
              />
              <ProtectedRoute
                path={WebRoutes.accountMintDiscordCheck}
                exact
                component={AccountMint}
              />
              <ProtectedRoute
                path={WebRoutes.accounts}
                exact
                component={Accounts}
              />
              <ProtectedRoute path={WebRoutes.words} exact component={Words} />
              <ProtectedRoute
                path={WebRoutes.statements}
                exact
                component={Statements}
              />
              <ProtectedRoute
                path={WebRoutes.activity}
                exact
                component={Activity}
              />
              <Route
                path={WebRoutes.root}
                component={() => <Redirect to="/" />}
              />
            </Switch>
          )}
        </Container>
      </Box>
    </>
  )
}

export default App
