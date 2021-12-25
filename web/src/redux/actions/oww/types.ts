export enum OWWActionType {
  changePostURL = 'OWW/changePostURL',
  clearInput = 'OWW/clearInput',

  getTokenIdsStart = 'OWW/getTokenIds/START',
  getTokenIdsSuccess = 'OWW/getTokenIds/SUCCESS',
  getTokenIdsFailure = 'OWW/getTokenIds/FAILURE',

  getPostPriceStart = 'OWW/getPostPrice/START',
  getPostPriceSuccess = 'OWW/getPostPrice/SUCCESS',
  getPostPriceFailure = 'OWW/getPostPrice/FAILURE',

  mintPostStart = 'OWW/mint/Post/START',
  mintPostSuccess = 'OWW/mint/Post/SUCCESS',
  mintPostFailure = 'OWW/mint/Post/FAILURE',
}

export type OWWActionPayload = {
  [OWWActionType.changePostURL]: {
    postUrl: string
  }

  [OWWActionType.clearInput]: void

  [OWWActionType.getTokenIdsStart]: void
  [OWWActionType.getTokenIdsSuccess]: {
    tokenIds: number[]
  }
  [OWWActionType.getTokenIdsFailure]: {
    error: Error
  }

  [OWWActionType.getPostPriceStart]: void
  [OWWActionType.getPostPriceSuccess]: {
    price: string
  }
  [OWWActionType.getPostPriceFailure]: {
    error: Error
  }

  [OWWActionType.mintPostStart]: {
    snName: string
    postId: string
  }
  [OWWActionType.mintPostSuccess]: {
    tokenId: string
  }
  [OWWActionType.mintPostFailure]: {
    error: Error
  }
}

export type OWWAction =
  | {
      type: OWWActionType.changePostURL
      payload: OWWActionPayload[OWWActionType.changePostURL]
    }
  | {
      type: OWWActionType.clearInput
      payload: OWWActionPayload[OWWActionType.clearInput]
    }
  | {
      type: OWWActionType.getTokenIdsStart
      payload: OWWActionPayload[OWWActionType.getTokenIdsStart]
    }
  | {
      type: OWWActionType.getTokenIdsSuccess
      payload: OWWActionPayload[OWWActionType.getTokenIdsSuccess]
    }
  | {
      type: OWWActionType.getTokenIdsFailure
      payload: OWWActionPayload[OWWActionType.getTokenIdsFailure]
    }
  | {
      type: OWWActionType.getPostPriceStart
      payload: OWWActionPayload[OWWActionType.getPostPriceStart]
    }
  | {
      type: OWWActionType.getPostPriceSuccess
      payload: OWWActionPayload[OWWActionType.getPostPriceSuccess]
    }
  | {
      type: OWWActionType.getPostPriceFailure
      payload: OWWActionPayload[OWWActionType.getPostPriceFailure]
    }
  | {
      type: OWWActionType.mintPostStart
      payload: OWWActionPayload[OWWActionType.mintPostStart]
    }
  | {
      type: OWWActionType.mintPostSuccess
      payload: OWWActionPayload[OWWActionType.mintPostSuccess]
    }
  | {
      type: OWWActionType.mintPostFailure
      payload: OWWActionPayload[OWWActionType.mintPostFailure]
    }
