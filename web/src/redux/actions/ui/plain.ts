import { AC } from '../../utils'
import { UIActionPayload, UIActionType } from './types'

export const setNetworkNotSupported: AC<
  UIActionType.setNetworkNotSupported,
  UIActionPayload[UIActionType.setNetworkNotSupported]
> = ({ isNetworkSupported }) => ({
  type: UIActionType.setNetworkNotSupported,
  payload: {
    isNetworkSupported,
  },
})
