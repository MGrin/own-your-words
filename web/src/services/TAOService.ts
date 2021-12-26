import { ethers } from 'ethers'
import { Request } from '../redux/reducers/activity'
import { AvailableContracts } from './EthersService'
import { Logger } from './Logger'

export class TAOService {
  private readonly logger = new Logger('TAOService')

  private contract: ethers.Contract

  constructor(_contract: ethers.Contract) {
    this.logger.log('Constructor')
    this.contract = _contract
  }

  public async getMyRequests(): Promise<Request[]> {
    this.logger.log('Get my requests')

    const requests = await this.contract.getMyRequests()

    return requests.map(
      (requestAsArr: any) =>
        ({
          id: requestAsArr.id.toNumber(),
          status: requestAsArr.status,
          error: requestAsArr.error,
          targetContract: AvailableContracts.owsn,
        } as Request)
    )
  }
}
