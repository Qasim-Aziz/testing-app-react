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
    $therapistIds: [String!]!
    $startTime: String!
    $endTime: String!
    $workingDays: [String!]!
  ) {
    createShift(
      input: { startTime: $startTime, endTime: $endTime, staffs: $therapistIds, days: $workingDays }
    ) {
      details {
        id
        name
        shift {
          startTime
          endTime
          days {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`
