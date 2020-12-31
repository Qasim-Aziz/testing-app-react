/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const SESSIONS_SUMMERY = gql`
  query($studentId: ID!) {
    sessionSummary(studentId: $studentId) {
      id
      sessions {
        sessionName {
          name
        }
      }
      sessionDate
      duration
      correctCount
      errorCount
      promptCount
      behCount
      toiletCount
    }
  }
`

export const FREQUENCY_DIS_TARGET = gql`
  query($student: ID!, $session: ID!) {
    freqDistriTarget(student: $student, session: $session, duration: 1000) {
      duration
      tarCount
      behRed
    }
  }
`
