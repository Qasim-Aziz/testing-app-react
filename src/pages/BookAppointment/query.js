/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

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
export const GET_AVAILABLE_SLOTS = gql`
  query getAppointmentSlots($therapistId: ID!, $date: Date!) {
    getAppointmentSlots(therapist: $therapistId, start: $date, end: $date) {
      data {
        slots {
          time
          isAvailable
        }
      }
    }
  }
`

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $title: String!
    $studentId: ID!
    $therapistId: ID!
    $note: String
    $purposeAssignment: String!
    $startDateAndTime: DateTime!
    $endDateAndTime: DateTime!
    $startDate: String!
    $endDate: String!
    $startTime: String!
    $endTime: String!
    $appointmentStatus: ID
  ) {
    CreateAppointment(
      input: {
        appointment: {
          title: $title
          student: $studentId
          therapist: $therapistId
          note: $note
          purposeAssignment: $purposeAssignment
          start: $startDateAndTime
          end: $endDateAndTime
          appointmentStatus: $appointmentStatus
        }
        recurring: {
          enableRecurring: false
          startDate: $startDate
          endDate: $endDate
          startTime: $startTime
          endTime: $endTime
          days: []
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`
