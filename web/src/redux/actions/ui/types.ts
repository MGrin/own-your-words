export enum UIActionType {
  setNetworkNotSupported = 'UI/changePostURL',
}

export type UIActionPayload = {
  [UIActionType.setNetworkNotSupported]: {
    isNetworkSupported: boolean
  }
}

export type UIAction = {
  type: UIActionType.setNetworkNotSupported
  payload: UIActionPayload[UIActionType.setNetworkNotSupported]
}
