/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const DELETE_APPOINTMENT = gql`
  mutation($id: ID!) {
    DeleteAppointment(id: $id) {
      success
    }
  }
`

export const UPDATE_APPOINTMENT = gql`
  mutation($id: ID!, $start: DateTime!, $end: DateTime!, $therapistId: ID) {
    UpdateAppointment(
      input: { appointment: { id: $id, start: $start, end: $end, therapist: $therapistId } }
    ) {
      appointment {
        id
        start
        end
        therapist {
          id
          name
          surname
        }
      }
    }
  }
`

export const TIME_SHEET_DATA = gql`
  query appointments($date: Date) {
    appointments(start_Date: $date) {
      edges {
        node {
          id
          start
          title
          end
          location {
            id
            location
          }
        }
      }
    }
  }
`

export const APPOINTMENTS_FOR_RANGE = gql`
  query appointments($dateFrom: Date, $dateTo: Date) {
    appointments(dateFrom: $dateFrom, dateTo: $dateTo) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
            lastname
            image
            mobileno
          }
          isApproved
          purposeAssignment
          title
          note
          therapist {
            id
            name
            surname
          }
          appointmentStatus {
            id
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`
