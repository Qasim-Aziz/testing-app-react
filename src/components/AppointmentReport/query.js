/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const GET_APPOINTMENTS = gql`
  query appointments($dateFrom: Date, $dateTo: Date, $studentId: ID, $therapistId: ID) {
    appointments(
      dateFrom: $dateFrom
      dateTo: $dateTo
      student: $studentId
      therapist: $therapistId
    ) {
      edges {
        node {
          id
          title
          start
          end
          isApproved
          note
          purposeAssignment
          student {
            id
            firstname
            lastname
          }
          therapist {
            id
            name
            surname
          }
          location {
            id
            location
          }
          appointmentStatus {
            id
            appointmentStatus
          }
        }
      }
    }
  }
`

export const GET_LEARNERS = gql`
  {
    students(isActive: true) {
      edges {
        node {
          id
          firstname
          lastname
        }
      }
    }
  }
`

export const GET_THERAPIST = gql`
  {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
          surname
        }
      }
    }
  }
`

export const GET_APPOINTMENT_STATUSES = gql`
  query {
    appointmentStatuses {
      id
      appointmentStatus
    }
  }
`

export const UPDATE_APPOINTMENT_STATUS = gql`
  mutation($appointmentId: ID!, $newStatus: ID) {
    UpdateAppointment(
      input: { appointment: { id: $appointmentId, appointmentStatus: $newStatus } }
    ) {
      appointment {
        id
        appointmentStatus {
          id
          appointmentStatus
        }
      }
    }
  }
`
