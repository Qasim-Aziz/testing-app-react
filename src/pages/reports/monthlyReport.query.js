/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const STUDENT_QUERY = gql`
  query StudentDetails($studentId: ID!) {
    student(id: $studentId) {
      id
      firstname
      lastname
      currentAddress
      dob
      email
      parentMobile
      createdAt
    }
  }
`

export const ss = gql`
  query {
    goalStatus {
      id
      status
    }
  }
`
// goals
export const GOALS_DETAILS = gql`
  query LongTermGoalProgress($studentId: ID!, $status: [ID]!, $start: Date!, $end: Date!) {
    goalsLongProgressReport(student: $studentId, status: $status, start: $start, end: $end) {
      masteryDays
      dateMastered
      goal {
        id
        goalName
        dateInitialted
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

export const GET_TARGET_DAILY_RESPONSE = gql`
  query getTargetDailyResponse($targetId: ID!, $start: Date!, $end: Date!) {
    getCorrectPercentage(target: $targetId, start: $start, end: $end) {
      date
      correctPercent
    }
  }
`

// Mand progress
export const GET_MAND_REPORT = gql`
  query getMandReport($studentId: ID!, $start: Date!, $end: Date!) {
    mandReport(studentId: $studentId, startDate: $start, endDate: $end) {
      total
      measurments
      data {
        date
        formattedDate
        count
      }
    }
  }
`

// behaviour template
export const GET_TEMPLATE_REPORT = gql`
  query getMandReport($studentId: ID!, $start: Date!, $end: Date!) {
    getTemplateForReports(student: $studentId, start: $start, end: $end) {
      template {
        id
        behaviorDef
        behaviorDescription
        student {
          id
          firstname
        }
        behavior {
          id
          behaviorName
        }
      }
    }
  }
`
export const DOMAIN = gql`
  query domainMastered($studentId: ID, $start: Date, $end: Date) {
    domainMastered(
      studentId: $studentId
      dateGte: $start
      dateLte: $end
      targetStatus: "U3RhdHVzVHlwZTo0"
    ) {
      target {
        id
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
      }
    }
  }
`
