import gql from 'graphql-tag'

/* eslint-disable import/prefer-default-export */
export const STAFFS = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

export const GET_ATTENDANCE = gql`
  query($start: Date!, $end: Date!, $therapist: ID!) {
    attendanceReport(dateGte: $start, dateLte: $end, therapist: $therapist) {
      date
      hours
    }
  }
`

export const TIMESHEET = gql`
  query($start: Date!, $end: Date!, $therapist: ID!) {
    timesheetReport(therapist: $therapist, dateGte: $start, dateLte: $end) {
      date
      hours
      appList {
        id
        title
        start
        end
        student {
          id
          firstname
        }
      }
      workList {
        id
        checkIn
        checkOut
      }
    }
  }
`
