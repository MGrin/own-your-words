import { getRequestsFailure, getRequestsStart, getRequestsSuccess } from '.'
import ethersService from '../../../services/EthersService'
import { Logger } from '../../../services/Logger'
import { Request } from '../../reducers/activity'
import { ThunkAC } from '../../utils'
import { ActivityActionPayload, ActivityActionType } from './types'

const logger = new Logger('ActivityAsyncActions')

export const getRequests: ThunkAC<
  ActivityActionPayload[ActivityActionType.getRequestsStart]
> = () => async (dispatch) => {
  dispatch(getRequestsStart())
  try {
    const tao = ethersService.getTAO()
    if (!tao) {
      throw new Error('TAO contract is not yet ready!')
    }

    const tpo = ethersService.getTPO()
    if (!tpo) {
      throw new Error('TPO contract is not yet ready!')
    }

    const taoRequests = await tao.getMyRequests()
    const tpoRequests = await tpo.getMyRequests()

    const taoRequestsById: { [k: number]: Request } = {}
    for (let i = 0; i < taoRequests.length; i++) {
      const req = taoRequests[i]

      if (!taoRequestsById[req.id]) {
        taoRequestsById[req.id] = req
        req.history = [req]
      } else {
        taoRequestsById[req.id].history?.push(req)
        if (req.status > taoRequestsById[req.id].status) {
          taoRequestsById[req.id].status = req.status
          taoRequestsById[req.id].error = req.error
        }
      }
    }

    const tpoRequestsById: { [k: number]: Request } = {}
    for (let i = 0; i < tpoRequests.length; i++) {
      const req = tpoRequests[i]

      if (!tpoRequestsById[req.id]) {
        tpoRequestsById[req.id] = req
        req.history = [req]
      } else {
        tpoRequestsById[req.id].history?.push(req)
        if (req.status > tpoRequestsById[req.id].status) {
          tpoRequestsById[req.id].status = req.status
          tpoRequestsById[req.id].error = req.error
        }
      }
    }

    const requests = [
      ...Object.values(taoRequestsById),
      ...Object.values(tpoRequestsById),
    ].sort((a, b) => a.id - b.id)

    dispatch(getRequestsSuccess({ requests }))
  } catch (error) {
    logger.error(error as Error)
    dispatch(getRequestsFailure({ error: error as Error }))
  }
}
