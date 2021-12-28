import {
  Heading,
  Stack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RequestDescription from '../components/RequestDescription'
import RequestStatus from '../components/RequestStatus'
import { getRequests } from '../redux/actions/activity'
import { activityRequestsSelector } from '../redux/selectors/activity'

const Activity = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getRequests())
  }, [dispatch])

  const { requests } = useSelector(activityRequestsSelector)

  return (
    <Stack maxW="100%" overflowX="auto">
      <Heading>Activity</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Request id</Th>
            <Th>Request status</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {requests.map((request) => (
            <Tr>
              <Td isNumeric>
                {request.targetContract}: {request.id}
              </Td>
              <Td>
                <RequestStatus request={request} />
              </Td>
              <Td>
                <RequestDescription request={request} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  )
}

export default Activity
