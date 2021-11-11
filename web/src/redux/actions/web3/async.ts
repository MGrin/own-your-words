import ethersService from "../../../services/EthersService";
import { Logger } from "../../../services/Logger";
import { ThunkAC } from "../../utils";
import { connectStart, connectSuccess, connectFailure } from "./plain";

const logger = new Logger("Web3AsyncActions");

export const connect: ThunkAC<void> = () => async (dispatch) => {
  dispatch(connectStart());
  try {
    await ethersService.connect();
    dispatch(
      connectSuccess({
        address: ethersService.address!,
        network: ethersService.network!,
        sweetAddress: ethersService.sweetAddress!,
      })
    );
  } catch (error) {
    logger.error(error as Error);
    dispatch(connectFailure({ error: error as Error }));
  }
};
