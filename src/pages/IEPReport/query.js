/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const GOAL_STATUS = gql`
  query($studentId: ID!) {
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

export const GOALS_DETAILS = gql`
  query LongTermGoalProgress($studentId: ID!, $status: [ID]!, $start: Date!, $end: Date!) {
    goalsLongProgressReport(student: $studentId, status: $status, start: $start, end: $end) {
      masteryDays
      dateMastered
      goal {
        id
        goalName
        dateInitialted
        dateEnd
        masterTar
        totalTar
        goalStatus {
          id
          status
        }
        shorttermgoalSet {
          edges {
            node {
              id
              goalName
              dateInitialted
              dateEnd
              masterDate
              goalStatus {
                id
                status
              }
              targetAllocateSet {
                edges {
                  node {
                    id
                    targetStatus {
                      id
                      statusName
                    }
                    masterDate
                    intherapyDate
                    targetAllcatedDetails {
                      id
                      targetName
                      dateBaseline
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const DOMAIN_MASTERED = gql`
  query($studentId: ID, $dateGte: Date, $dateLte: Date) {
    domainMastered(studentId: $studentId, dateGte: $dateGte, dateLte: $dateLte) {
      totalCount
      target {
        id
        domainName
        targetId {
          id
          domain {
            id
            domain
          }
        }
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
        }
        intherapyDate
        masterDate
        inmaintainenceDate
      }
    }
  }
`
