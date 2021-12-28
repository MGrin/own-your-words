import { UIAction, UIActionType } from '../actions/ui/types'

export type UIState = {
  networkNotSupportedBannerVisible: boolean
}

const initialState: UIState = {
  networkNotSupportedBannerVisible: false,
}

const reducer = (state: UIState = initialState, action: UIAction) => {
  switch (action.type) {
    case UIActionType.setNetworkNotSupported: {
      return {
        ...state,
        networkNotSupportedBannerVisible: !action.payload.isNetworkSupported,
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
