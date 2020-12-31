/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GOAL_STATUS = gql`
  query (studentId: ID!) {
    goalStatus(student: $studentId) {
      id
      status
      longtermgoalSet {
        edges {
          node {
            id
            goalName
            description
            dateInitialted
            dateEnd
          }
        }
      }
    }
  }
`
