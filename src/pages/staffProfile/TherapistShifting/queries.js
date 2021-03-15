/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GET_SHIFTING = gql`
  query($therapistId: ID!) {
    staff(id: $therapistId) {
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
`

export const UPDATE_SHIFTING = gql`
  mutation UpdateShifting(
    $therapistId: String!
    $startTime: String!
    $endTime: String!
    $workingDays: [String!]!
  ) {
    createShift(
      input: {
        startTime: $startTime
        endTime: $endTime
        staffs: [$therapistId]
        days: $workingDays
      }
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
