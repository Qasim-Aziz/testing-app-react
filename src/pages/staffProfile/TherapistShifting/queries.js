/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GET_SHIFTING = gql`
  query {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

export const UPDATE_SHIFTING = gql`
  mutation UpdateShifting(
    $therapistId: ID!
    $startTime: String!
    $endTime: String!
    $workingDays: [String!]!
  ) {
    UpdateShifting(
      isForAllTherapist: false
      therapistId: therapistId
      startTime: startTime
      endTime: endTime
      workingDays: workingDays
    ) {
      status
    }
  }
`
