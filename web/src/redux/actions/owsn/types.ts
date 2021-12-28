export enum OWSNActionType {
  checkAccountAvailabilityStart = 'OWSN/checkAccountAvailability/START',
  checkAccountAvailabilitySuccess = 'OWSN/checkAccountAvailability/SUCCESS',
  checkAccountAvailabilityFailure = 'OWSN/checkAccountAvailability/FAILURE',

  getTokenIdsStart = 'OWSN/getTokenIds/START',
  getTokenIdsSuccess = 'OWSN/getTokenIds/SUCCESS',
  getTokenIdsFailure = 'OWSN/getTokenIds/FAILURE',

  getTwitterPriceStart = 'OWSN/getTwitterPrice/START',
  getTwitterPriceSuccess = 'OWSN/getTwitterPrice/SUCCESS',
  getTwitterPriceFailure = 'OWSN/getTwitterPrice/FAILURE',

  getDiscordPriceStart = 'OWSN/getDiscordPrice/START',
  getDiscordPriceSuccess = 'OWSN/getDiscordPrice/SUCCESS',
  getDiscordPriceFailure = 'OWSN/getDiscordPrice/FAILURE',

  mintTwitterStart = 'OWSN/mint/twitter/START',
  mintTwitterSuccess = 'OWSN/mint/twitter/SUCCESS',
  mintTwitterFailure = 'OWSN/mint/twitter/FAILURE',

  mintDiscordStart = 'OWSN/mint/discord/START',
  mintDiscordSuccess = 'OWSN/mint/discord/SUCCESS',
  mintDiscordFailure = 'OWSN/mint/discord/FAILURE',
}

export type OWSNActionPayload = {
  [OWSNActionType.checkAccountAvailabilityStart]: {
    snName: string
    snId: string
  }
  [OWSNActionType.checkAccountAvailabilitySuccess]: {
    snName: string
    available: boolean
  }
  [OWSNActionType.checkAccountAvailabilityFailure]: {
    snName: string
    error: Error
  }

  [OWSNActionType.getTokenIdsStart]: void
  [OWSNActionType.getTokenIdsSuccess]: {
    tokenIds: number[]
  }
  [OWSNActionType.getTokenIdsFailure]: {
    error: Error
  }

  [OWSNActionType.getTwitterPriceStart]: void
  [OWSNActionType.getTwitterPriceSuccess]: {
    price: string
  }
  [OWSNActionType.getTwitterPriceFailure]: {
    error: Error
  }

  [OWSNActionType.getDiscordPriceStart]: void
  [OWSNActionType.getDiscordPriceSuccess]: {
    price: string
  }
  [OWSNActionType.getDiscordPriceFailure]: {
    error: Error
  }

  [OWSNActionType.mintTwitterStart]: {
    oauthToken: string
    oauthVerifier: string
  }
  [OWSNActionType.mintTwitterSuccess]: {
    tokenId: string
  }
  [OWSNActionType.mintTwitterFailure]: {
    error: Error
  }

  [OWSNActionType.mintDiscordStart]: {
    code: string
    redirectUrl: string
  }
  [OWSNActionType.mintDiscordSuccess]: {
    tokenId: string
  }
  [OWSNActionType.mintDiscordFailure]: {
    error: Error
  }
}

export type OWSNAction =
  | {
      type: OWSNActionType.getTwitterPriceStart
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceStart]
    }
  | {
      type: OWSNActionType.getTwitterPriceSuccess
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceSuccess]
    }
  | {
      type: OWSNActionType.getTwitterPriceFailure
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceFailure]
    }
  | {
      type: OWSNActionType.getDiscordPriceStart
      payload: OWSNActionPayload[OWSNActionType.getDiscordPriceStart]
    }
  | {
      type: OWSNActionType.getDiscordPriceSuccess
      payload: OWSNActionPayload[OWSNActionType.getDiscordPriceSuccess]
    }
  | {
      type: OWSNActionType.getDiscordPriceFailure
      payload: OWSNActionPayload[OWSNActionType.getDiscordPriceFailure]
    }
  | {
      type: OWSNActionType.checkAccountAvailabilityStart
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart]
    }
  | {
      type: OWSNActionType.checkAccountAvailabilitySuccess
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilitySuccess]
    }
  | {
      type: OWSNActionType.checkAccountAvailabilityFailure
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilityFailure]
    }
  | {
      type: OWSNActionType.mintTwitterStart
      payload: OWSNActionPayload[OWSNActionType.mintTwitterStart]
    }
  | {
      type: OWSNActionType.mintTwitterSuccess
      payload: OWSNActionPayload[OWSNActionType.mintTwitterSuccess]
    }
  | {
      type: OWSNActionType.mintTwitterFailure
      payload: OWSNActionPayload[OWSNActionType.mintTwitterFailure]
    }
  | {
      type: OWSNActionType.mintDiscordStart
      payload: OWSNActionPayload[OWSNActionType.mintDiscordStart]
    }
  | {
      type: OWSNActionType.mintDiscordSuccess
      payload: OWSNActionPayload[OWSNActionType.mintDiscordSuccess]
    }
  | {
      type: OWSNActionType.mintDiscordFailure
      payload: OWSNActionPayload[OWSNActionType.mintDiscordFailure]
    }
  | {
      type: OWSNActionType.getTokenIdsStart
      payload: OWSNActionPayload[OWSNActionType.getTokenIdsStart]
    }
  | {
      type: OWSNActionType.getTokenIdsSuccess
      payload: OWSNActionPayload[OWSNActionType.getTokenIdsSuccess]
    }
  | {
      type: OWSNActionType.getTokenIdsFailure
      payload: OWSNActionPayload[OWSNActionType.getTokenIdsFailure]
    }
