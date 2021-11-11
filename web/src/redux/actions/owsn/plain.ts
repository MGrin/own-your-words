import { AC } from "../../utils";
import { OWSNActionPayload, OWSNActionType } from "./types";

export const checkAccountAvailabilityStart: AC<
  OWSNActionType.checkAccountAvailabilityStart,
  OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart]
> = ({ snName, snId }) => ({
  type: OWSNActionType.checkAccountAvailabilityStart,
  payload: {
    snName,
    snId,
  },
});
export const checkAccountAvailabilitySuccess: AC<
  OWSNActionType.checkAccountAvailabilitySuccess,
  OWSNActionPayload[OWSNActionType.checkAccountAvailabilitySuccess]
> = ({ available, snName }) => ({
  type: OWSNActionType.checkAccountAvailabilitySuccess,
  payload: {
    snName,
    available,
  },
});
export const checkAccountAvailabilityFailure: AC<
  OWSNActionType.checkAccountAvailabilityFailure,
  OWSNActionPayload[OWSNActionType.checkAccountAvailabilityFailure]
> = ({ error, snName }) => ({
  type: OWSNActionType.checkAccountAvailabilityFailure,
  payload: {
    snName,
    error,
  },
});

export const getTokenIdsStart: AC<
  OWSNActionType.getTokenIdsStart,
  OWSNActionPayload[OWSNActionType.getTokenIdsStart]
> = () => ({
  type: OWSNActionType.getTokenIdsStart,
  payload: undefined,
});

export const getTokenIdsSuccess: AC<
  OWSNActionType.getTokenIdsSuccess,
  OWSNActionPayload[OWSNActionType.getTokenIdsSuccess]
> = ({ tokenIds }) => ({
  type: OWSNActionType.getTokenIdsSuccess,
  payload: {
    tokenIds,
  },
});

export const getTokenIdsFailure: AC<
  OWSNActionType.getTokenIdsFailure,
  OWSNActionPayload[OWSNActionType.getTokenIdsFailure]
> = ({ error }) => ({
  type: OWSNActionType.getTokenIdsFailure,
  payload: {
    error,
  },
});

export const getTwitterPriceStart: AC<
  OWSNActionType.getTwitterPriceStart,
  OWSNActionPayload[OWSNActionType.getTwitterPriceStart]
> = () => ({
  type: OWSNActionType.getTwitterPriceStart,
  payload: undefined,
});

export const getTwitterPriceSuccess: AC<
  OWSNActionType.getTwitterPriceSuccess,
  OWSNActionPayload[OWSNActionType.getTwitterPriceSuccess]
> = ({ price }) => ({
  type: OWSNActionType.getTwitterPriceSuccess,
  payload: {
    price,
  },
});

export const getTwitterPriceFailure: AC<
  OWSNActionType.getTwitterPriceFailure,
  OWSNActionPayload[OWSNActionType.getTwitterPriceFailure]
> = ({ error }) => ({
  type: OWSNActionType.getTwitterPriceFailure,
  payload: {
    error,
  },
});

export const mintTwitterStart: AC<
  OWSNActionType.mintTwitterStart,
  OWSNActionPayload[OWSNActionType.mintTwitterStart]
> = ({ oauthToken, oauthVerifier }) => ({
  type: OWSNActionType.mintTwitterStart,
  payload: {
    oauthToken,
    oauthVerifier,
  },
});

export const mintTwitterSuccess: AC<
  OWSNActionType.mintTwitterSuccess,
  OWSNActionPayload[OWSNActionType.mintTwitterSuccess]
> = ({ tokenId }) => ({
  type: OWSNActionType.mintTwitterSuccess,
  payload: {
    tokenId,
  },
});

export const mintTwitterFailure: AC<
  OWSNActionType.mintTwitterFailure,
  OWSNActionPayload[OWSNActionType.mintTwitterFailure]
> = ({ error }) => ({
  type: OWSNActionType.mintTwitterFailure,
  payload: {
    error,
  },
});
