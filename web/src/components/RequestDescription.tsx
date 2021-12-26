import React from 'react'
import { Request } from '../redux/reducers/activity'
import { AvailableContracts } from '../services/EthersService'

type RequestDescriptionProps = {
  request: Request
}

const RequestDescription = ({ request }: RequestDescriptionProps) => {
  if (request.targetContract === AvailableContracts.owsn) {
    return <>OWSN token: ownership of your social network on blockchain.</>
  }

  if (request.targetContract === AvailableContracts.oww) {
    return <>OWW token: ownership of your post on blockchain.</>
  }

  return null
}

export default RequestDescription
