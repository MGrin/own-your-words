import React from 'react'
import type { RouteProps } from 'react-router-dom'
import { Route, Redirect } from 'react-router-dom'

import { useSelector } from 'react-redux'
import web3Selector from '../redux/selectors/web3'

const ProtectedRoute: React.FC<RouteProps> = ({
  component: Component,
  ...routerProps
}) => {
  const { connected } = useSelector(web3Selector)
  return (
    <Route
      {...routerProps}
      render={(props) =>
        // @ts-expect-error
        connected ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  )
}

export default ProtectedRoute
