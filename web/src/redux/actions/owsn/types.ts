export enum OWSNActionType {
  checkAccountAvailabilityStart = "OWSN/checkAccountAvailability/START",
  checkAccountAvailabilitySuccess = "OWSN/checkAccountAvailability/SUCCESS",
  checkAccountAvailabilityFailure = "OWSN/checkAccountAvailability/FAILURE",

  getTokenIdsStart = "OWSN/getTokenIds/START",
  getTokenIdsSuccess = "OWSN/getTokenIds/SUCCESS",
  getTokenIdsFailure = "OWSN/getTokenIds/FAILURE",

  getTwitterPriceStart = "OWSN/getTwitterPrice/START",
  getTwitterPriceSuccess = "OWSN/getTwitterPrice/SUCCESS",
  getTwitterPriceFailure = "OWSN/getTwitterPrice/FAILURE",

  mintTwitterStart = "OWSN/mint/twitter/START",
  mintTwitterSuccess = "OWSN/mint/twitter/SUCCESS",
  mintTwitterFailure = "OWSN/mint/twitter/FAILURE",
}

export type OWSNActionPayload = {
  [OWSNActionType.checkAccountAvailabilityStart]: {
    snName: string;
    snId: string;
  };
  [OWSNActionType.checkAccountAvailabilitySuccess]: {
    snName: string;
    available: boolean;
  };
  [OWSNActionType.checkAccountAvailabilityFailure]: {
    snName: string;
    error: Error;
  };

  [OWSNActionType.getTokenIdsStart]: void;
  [OWSNActionType.getTokenIdsSuccess]: {
    tokenIds: string[];
  };
  [OWSNActionType.getTokenIdsFailure]: {
    error: Error;
  };

  [OWSNActionType.getTwitterPriceStart]: void;
  [OWSNActionType.getTwitterPriceSuccess]: {
    price: string;
  };
  [OWSNActionType.getTwitterPriceFailure]: {
    error: Error;
  };

  [OWSNActionType.mintTwitterStart]: {
    oauthToken: string;
    oauthVerifier: string;
  };
  [OWSNActionType.mintTwitterSuccess]: {
    tokenId: string;
  };
  [OWSNActionType.mintTwitterFailure]: {
    error: Error;
  };
};

export type OWSNAction =
  | {
      type: OWSNActionType.getTwitterPriceStart;
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceStart];
    }
  | {
      type: OWSNActionType.getTwitterPriceSuccess;
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceSuccess];
    }
  | {
      type: OWSNActionType.getTwitterPriceFailure;
      payload: OWSNActionPayload[OWSNActionType.getTwitterPriceFailure];
    }
  | {
      type: OWSNActionType.checkAccountAvailabilityStart;
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart];
    }
  | {
      type: OWSNActionType.checkAccountAvailabilitySuccess;
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilitySuccess];
    }
  | {
      type: OWSNActionType.checkAccountAvailabilityFailure;
      payload: OWSNActionPayload[OWSNActionType.checkAccountAvailabilityFailure];
    }
  | {
      type: OWSNActionType.mintTwitterStart;
      payload: OWSNActionPayload[OWSNActionType.mintTwitterStart];
    }
  | {
      type: OWSNActionType.mintTwitterSuccess;
      payload: OWSNActionPayload[OWSNActionType.mintTwitterSuccess];
    }
  | {
      type: OWSNActionType.mintTwitterFailure;
      payload: OWSNActionPayload[OWSNActionType.mintTwitterFailure];
    };
