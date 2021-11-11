import {
  checkAccountAvailabilityFailure,
  checkAccountAvailabilityStart,
  checkAccountAvailabilitySuccess,
  getTokenIdsFailure,
  getTokenIdsStart,
  getTokenIdsSuccess,
  getTwitterPriceFailure,
  getTwitterPriceStart,
  getTwitterPriceSuccess,
  mintTwitterFailure,
  mintTwitterStart,
} from ".";
import ethersService from "../../../services/EthersService";
import { Logger } from "../../../services/Logger";
import { ThunkAC } from "../../utils";
import { OWSNActionPayload, OWSNActionType } from "./types";

const logger = new Logger("OWSNAsyncActions");

export const checkAccountAvailability: ThunkAC<
  OWSNActionPayload[OWSNActionType.checkAccountAvailabilityStart]
> =
  ({ snName, snId }) =>
  async (dispatch) => {
    dispatch(checkAccountAvailabilityStart({ snName, snId }));
    try {
      const owsn = await ethersService.getOWSN();
      if (!owsn) {
        const error = new Error("OWSN contract is not yet ready!");
        logger.error(error as Error);
        dispatch(
          checkAccountAvailabilityFailure({ snName, error: error as Error })
        );
        return;
      }

      await owsn.getOwnedAccountByGenSnId(owsn.getGenId(snName, snId));
      dispatch(checkAccountAvailabilitySuccess({ snName, available: false }));
    } catch (error) {
      logger.error(error as Error);
      dispatch(checkAccountAvailabilitySuccess({ snName, available: true }));
    }
  };

export const getTokenIds: ThunkAC<
  OWSNActionPayload[OWSNActionType.getTokenIdsStart]
> = () => async (dispatch) => {
  dispatch(getTokenIdsStart());
  try {
    const owsn = await ethersService.getOWSN();
    if (!owsn) {
      throw new Error("OWSN contract is not yet ready!");
    }

    const tokenIds = await owsn.getOwnedAccountTokens();
    dispatch(getTokenIdsSuccess({ tokenIds }));
  } catch (error) {
    logger.error(error as Error);
    dispatch(getTokenIdsFailure({ error: error as Error }));
  }
};

export const getTwitterPrice: ThunkAC<
  OWSNActionPayload[OWSNActionType.getTwitterPriceStart]
> = () => async (dispatch) => {
  dispatch(getTwitterPriceStart());
  try {
    const tm = await ethersService.getTM();
    if (!tm) {
      throw new Error("TM contract is not yet ready!");
    }

    const price = await tm.getPrice();
    dispatch(getTwitterPriceSuccess({ price }));
  } catch (error) {
    logger.error(error as Error);
    dispatch(getTwitterPriceFailure({ error: error as Error }));
  }
};

export const mintTwitter: ThunkAC<
  OWSNActionPayload[OWSNActionType.mintTwitterStart]
> =
  ({ oauthToken, oauthVerifier }) =>
  async (dispatch) => {
    dispatch(mintTwitterStart({ oauthToken, oauthVerifier }));
    try {
      const owsn = await ethersService.getOWSN();
      if (!owsn) {
        throw new Error("OWSN contract is not yet ready!");
      }

      const tm = await ethersService.getTM();
      if (!tm) {
        throw new Error("TM contract is not yet ready!");
      }

      const price = await tm.getPrice();
      await owsn.mintTwitterOWSN(oauthToken, oauthVerifier, price);
    } catch (error) {
      logger.error(error as Error);
      dispatch(mintTwitterFailure({ error: error as Error }));
    }
  };
