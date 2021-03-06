/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const ALL_THERAPIST = gql`
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
    $isForAllTherapist: Boolean!
    $therapistId: ID!
    $startTime: String!
    $endTime: String!
    $workingDays: [String!]!
  ) {
    UpdateShifting(
      isForAllTherapist: isForAllTherapist
      therapistId: therapistId
      startTime: startTime
      endTime: endTime
      workingDays: workingDays
    ) {
      status
    }
  }
`
