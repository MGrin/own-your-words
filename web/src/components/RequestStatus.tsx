import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import { Request } from '../redux/reducers/activity'

type RequestStatusProps = {
  request: Request
}

const RequestStatus = ({ request }: RequestStatusProps) => {
  if (request.status === 1) {
    return (
      <Flex>
        <Spinner mr={2} />
        <Text>Pending</Text>
      </Flex>
    )
  }

  if (request.status === 2) {
    return (
      <Flex>
        <Spinner mr={2} />
        <Text>Processing</Text>
      </Flex>
    )
  }

  if (request.status === 3) {
    return (
      <Flex>
        <CheckIcon mr={2} />
        <Text>Succeeded</Text>
      </Flex>
    )
  }

  if (request.status === 4) {
    console.log(request)
    return (
      <Flex>
        <WarningIcon mr={2} />
        <Text>Failed: {request.error}</Text>
      </Flex>
    )
  }

  return null
}

export default RequestStatus
